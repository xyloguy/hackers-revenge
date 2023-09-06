class Round < ApplicationRecord
  MAX_CYCLES = 1_000
  DETERMINISTIC = false

  belongs_to :battle

  accepts_nested_attributes_for :battle

  validates :round_number, :presence => true
  validates :program1_start_ip, :presence => true
  validates :program2_start_ip, :presence => true
  validates :first_player, :inclusion => { :in => [1, 2] }

  enum :winner => {
    :tie => 0,
    :winner1 => 1,
    :winner2 => 2
  }

  attr_reader :cycles # no longer stored in the DB; call the run method to generate

  def self.build_for_test(player1_name:, player2_name:, program1_code:, program2_code:)
    player1 = ::Player.new(:name => player1_name, :token => "unused")
    player2 = ::Player.new(:name => player2_name, :token => "unused")

    program1 = ::Program.build(player1, program1_code)
    program2 = ::Program.build(player2, program2_code)

    battle = ::Battle.new(:program1 => program1, :program2 => program2)

    round = ::Round.new(:battle => battle, :round_number => 1, :first_player => 1)
    round.randomize_start_ips
    round
  end

  def randomize_start_ips
    srand(battle.program1.player.token.hash + battle.program2.player.token.hash + round_number) if DETERMINISTIC

    # Have to use size not count because instructions might not be persisted to DB.
    p1_instructions_count = battle.program1.instructions.size
    p2_instructions_count = battle.program2.instructions.size

    self.program1_start_ip = rand(256)
    self.program2_start_ip = (program1_start_ip + p1_instructions_count + rand(257 - p1_instructions_count - p2_instructions_count)) % 256
  end

  # Winner gets set and cycles get added to, but save is *not* called automatically.
  def run
    return false unless validate # sets errors and returns false if program1 or program2 have invalid instructions
    run!(:do_validate => false)
  rescue => e
    errors.add(:base, "Unexpected failure running round: #{e.message}")
    false
  end

  # Winner gets set and cycles get added to, but save! is *not* called automatically.
  def run!(do_validate: true)
    self.cycles = []
    self.winner = nil

    validate! if do_validate # fails if program1 or program2 have invalid instructions

    memory = ::Array.new(256)
    progs = []
    progs[0] = ::RunningProgram.new(1, memory, program1_start_ip, battle.program1.prepared_instructions)
    progs[1] = ::RunningProgram.new(2, memory, program2_start_ip, battle.program2.prepared_instructions)

    first_index = first_player - 1
    (1..MAX_CYCLES).each do |cycle_num|
      run_cycle(cycle_num, progs[first_index])
      break if winner.present?

      run_cycle(cycle_num, progs[1 - first_index])
      break if winner.present?
    end

    self.winner ||= :tie
    cycles[-1].status = ::Cycle::STATUS_TIE if tie? && cycles.present?

    true
  end

  # Cycles are no longer persisted to the DB; always call run before calling this.
  def to_journal_hash(filter_p2: false)
    self.cycles ||= []

    program1_hash = battle.program1.to_hash_for_journal(program1_start_ip)
    program2_hash = battle.program2.to_hash_for_journal(program2_start_ip)
    journal_entries = cycles.map(&:to_hash_for_journal)

    if filter_p2
      program2_hash[:code].each do |inst|
        inst[:opcode] = ""
        inst[:arg] = nil
      end

      journal_entries.each do |entry|
        next unless entry[:program] == 2
        entry[:opcode] = ""
        entry[:arg] = nil
      end
    end

    {
      :program1 => program1_hash,
      :program2 => program2_hash,
      :journal => journal_entries,
      :winner => ::Round.winners[winner]
    }
  end

private

  attr_writer :cycles

  def add_cycle(cycle_num, status, prog)
    cycles << ::Cycle.new(
      :cycle_number => cycle_num,
      :program_number => prog.program_num,
      :status => status,
      :opcode => prog.ran_opcode,
      :argument => prog.ran_argument,
      :old_ip => prog.old_ip,
      :new_ip => prog.ip,
      :old_stack => prog.old_stack.join(","),
      :new_stack => prog.stack.join(","),
      :read_addr_first => prog.read_addr_first,
      :read_addr_last => prog.read_addr_last,
      :writes => prog.wrotes
    )
  end

  def run_cycle(cycle_num, prog)
    status = prog.run_next_instruction
    add_cycle(cycle_num, status, prog)
    self.winner = 3 - prog.program_num if status != ::Cycle::STATUS_RUNNING
  end
end
