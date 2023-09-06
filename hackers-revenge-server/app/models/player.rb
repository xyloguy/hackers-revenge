class Player < ApplicationRecord
  BATTLES_AGAINST_TOP_TEN = 5
  BATTLES_AGAINST_ANY = 5

  DUPLICATE_NAME_CHECKS = 10

  belongs_to :last_battle, :class_name => "Battle", :optional => true
  belongs_to :last_program, :class_name => "Program", :optional => true
  has_many :programs, :dependent => :destroy

  validates :token, :presence => true
  validates :name, :presence => true
  validates :email, :format => { :with => /\A[^\s]+@[^\s]+\z/ }, :allow_nil => true # allow nil because player is initially created without an email; it must be provided every time a program is uploaded
  validates :phone, :format => { :with => /\d/ }, :allow_nil => true # allow nil because player is initially created without a phone; it must be provided every time a program is uploaded
  validates :wins, :presence => true
  validates :losses, :presence => true
  validates :ties, :presence => true
  validates :score, :presence => true

  validate :email_unchanged, :on => :update

  before_validation :default_points, :on => :create
  before_validation :adjust_score
  before_validation :dont_erase_phone, :on => :update

  scope :contenders, lambda { joins(:last_program).order("programs.created_at DESC") }
  scope :top_ten, lambda { where.not(:place => nil).order(:place).limit(10) }

  def self.new_random
    new(:token => random_token, :name => random_name)
  end

  def self.random_name
    DUPLICATE_NAME_CHECKS.times do
      adj = ::Faker::Adjective.positive.capitalize
      animal = ::Faker::Creature::Animal.name.capitalize
      name = "#{adj} #{animal}"
      return name if find_by(:name => name).nil?
    end
    fail "Having a hard time finding a unique name"
  end

  def self.random_token
    ::Faker::Base.letterify("????????").downcase
  end

  # Run a battle between two given players.
  # The last_battle_id is set and wins/ties/losses get incremented, but save! is *not* called automatically.
  def self.run_battle!(player1, player2)
    # Instantiate and run battle; winner is set and rounds are added.
    battle = ::Battle.new(:program1 => player1.last_program, :program2 => player2.last_program)
    battle.run!

    # Update scores.
    if battle.tie?
      player1.ties += 1
      player2.ties += 1
    elsif battle.winner1?
      player1.wins += 1
      player2.losses += 1
    elsif battle.winner2?
      player2.wins += 1
      player1.losses += 1
    else
      fail "Battle#run! didn't set a winner!"
    end

    player1.last_battle = battle
    player2.last_battle = battle
  end

  def self.to_contenders_hash(count, show_real_names: false)
    { :contenders => contenders.limit(count).map { |p| p.to_hash_for_contender(:show_real_names => show_real_names) } }
  end

  def self.to_leaderboard_hash(show_real_names: false)
    {
      :leaders => top_ten.map { |p| p.to_hash_for_leader(:show_real_names => show_real_names) },
      :remaining_seconds => ::TournamentInfo.instance.remaining_seconds
    }
  end

  def last_opponent
    return nil if last_battle.nil?

    case last_program_num
    when 1 then last_battle.program2&.player
    when 2 then last_battle.program1&.player
    end
  end

  # Was I player number 1 or 2 (program 1 or 2) in the last battle?
  def last_program_num
    if last_battle&.program1&.player_id == id
      1
    elsif last_battle&.program2&.player_id == id
      2
    end
  end

  # Who was the winner of the last battle: me (1), opponent (-1), or tie (0).
  def last_winner
    return nil if last_battle.nil?
    return 0 if last_battle.tie?
    last_program_num == ::Battle.winners[last_battle.winner] ? 1 : -1
  end

  def reset_points
    self.wins = 0
    self.losses = 0
    self.ties = 0
    self.score = 0
  end

  def to_hash_for_contender(show_real_names: false)
    contender_name = (show_real_names && real_name).presence || name

    {
      :name => contender_name,
      :score => score,
      :last_program_timestamp => last_program&.created_at,
      :last_battle_timestamp => last_battle&.created_at
    }
  end

  def to_hash_for_leader(show_real_names: false)
    pl_name = (show_real_names && real_name).presence || name
    op_name = (show_real_names && last_opponent&.real_name).presence || last_opponent&.name

    {
      :name => pl_name,
      :score => score,
      :wins => wins,
      :ties => ties,
      :losses => losses,
      :last_battle_id => last_battle_id,
      :last_battle_timestamp => last_battle&.created_at,
      :opponent_name => op_name,
      :winner => last_winner
    }
  end

private

  def adjust_score
    self.score = (wins * 2) + ties # losses don't affect score
  end

  def default_points
    self.wins ||= 0
    self.losses ||= 0
    self.ties ||= 0
    self.score ||= 0
  end

  def dont_erase_phone
    self.phone = phone_was if phone_changed? && phone.blank?
  end

  def email_unchanged
    errors.add(:email, "cannot change") if email_changed? && email_was.present?
  end
end
