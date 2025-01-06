class TournamentInfo < ApplicationRecord
  # Ensure only one row can ever exist, the one created by calling instance.
  validates :id, :inclusion => { :in => [1] }

  def self.increment_matches
    increment_counter(:matches, 1, :touch => true) # rubocop:disable Rails/SkipsModelValidations
  end

  def self.instance
    find_by(:id => 1) || create!(:id => 1, :matches => 0, :end_at => 1.year.from_now)
  end

  def end_time
    begin
      env_time_defined = ENV.fetch('TOURNAMENT_END_TIME', false)
      if env_time_defined != false
        ::Time.parse(env_time_defined)
      else
        raise "Time Not Defined, falling back"
      end
    rescue
      end_at
    end
  end

  def ended?
    ::Time.current > end_time
  end

  def remaining_seconds
    (end_time - ::Time.current).to_i.round
  end

  def running?
    !ended?
  end
end
