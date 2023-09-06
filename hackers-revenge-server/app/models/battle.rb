class Battle < ApplicationRecord
  MAX_ROUNDS = 4

  belongs_to :program1, :class_name => "Program"
  belongs_to :program2, :class_name => "Program"
  has_many :rounds, :dependent => :destroy

  accepts_nested_attributes_for :program1
  accepts_nested_attributes_for :program2

  after_save :update_players

  enum :winner => {
    :tie => 0,
    :winner1 => 1,
    :winner2 => 2
  }

  scope :for_program, lambda { |program_id| where(:program1_id => program_id).or(where(:program2_id => program_id)) }

  # Run a battle (all rounds) between program1 and program2.
  # Winner gets set and rounds get added to, but save! is *not* called automatically.
  def run!
    validate! # fail if program1 or program2 not set

    rounds.clear
    first_player = 1
    (1..MAX_ROUNDS).each do |round_number|
      round = rounds.build(:round_number => round_number, :first_player => first_player)
      round.randomize_start_ips
      round.run!

      first_player = 3 - first_player
    end

    set_winner
  end

private

  def update_players
    program1&.player&.update(:last_battle_id => id)
    program2&.player&.update(:last_battle_id => id)
  end

  def set_winner
    winner1s = winner2s = 0
    rounds.each do |round|
      winner1s += 1 if round.winner1?
      winner2s += 1 if round.winner2?
    end

    if winner1s > winner2s
      self.winner = :winner1
    elsif winner2s > winner1s
      self.winner = :winner2
    else
      self.winner = :tie
    end
  end
end
