class Program < ApplicationRecord
  MAX_INSTRUCTIONS = 24

  belongs_to :player, :autosave => true
  has_many :instructions, -> { order(:line_number) }, :inverse_of => :program, :dependent => :delete_all, :after_add => :instruction_added, :index_errors => true
  has_many :battles_as_p1, :class_name => "Battle", :foreign_key => "program1_id", :inverse_of => :program1, :dependent => :restrict_with_exception
  has_many :battles_as_p2, :class_name => "Battle", :foreign_key => "program2_id", :inverse_of => :program2, :dependent => :restrict_with_exception

  accepts_nested_attributes_for :instructions

  validate :instruction_count_not_too_big

  after_save :update_player

  def self.build(player, code)
    program = ::Program.new(:player => player)

    line_number = 1
    code.each do |c|
      program.instructions.build(:line_number => line_number, :opcode => c[:opcode], :argument => c[:arg])
      break if line_number > MAX_INSTRUCTIONS
      line_number += 1
    end

    program
  end

  def battles
    ::Battle.for_program(id)
  end

  def prepared_instructions
    # Never allow an empty list of instructions to be used for competing.
    return [::Instruction.new(:opcode => "HCF")] if instructions.blank?

    # Instructions loaded from the DB will be ordered properly, but non-persisted
    # ones may not be; use .sort_by to ensure proper order no matter what.
    instructions.sort_by { |i| i.line_number.to_i }
  end

  def to_code_array_for_build
    prepared_instructions.map do |inst|
      {
        :opcode => inst.opcode,
        :arg => inst.argument
      }
    end
  end

  def to_hash_for_journal(start_ip)
    {
      :player_name => player.name,
      :start_ip => start_ip,
      :code => code_array_for_journal(start_ip)
    }
  end

private

  def code_array_for_journal(start_ip)
    prepared_instructions.map.with_index(start_ip) do |inst, index|
      {
        :addr => index % 256,
        :opcode => inst.opcode,
        :arg => inst.argument
      }
    end
  end

  def instruction_added(_instruction)
    @instructions_added = true
  end

  def instruction_count_not_too_big
    errors.add(:instructions, "exceeds limit") if @instructions_added && instructions.size > MAX_INSTRUCTIONS
  end

  def update_player
    player.last_program_id = id
    player.save
  end
end
