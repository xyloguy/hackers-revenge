class TournamentInfo < ApplicationRecord
  # Ensure only one row can ever exist, the one created by calling instance.
  validates :id, :inclusion => { :in => [1] }

  def self.increment_matches
    increment_counter(:matches, 1, :touch => true) # rubocop:disable Rails/SkipsModelValidations
  end

  def self.instance
    begin
      env_time_defined = ENV.fetch('TOURNAMENT_END_TIME', false)
      if env_time_defined != false
        zone = ActiveSupport::TimeZone["Mountain Standard Time (US & Canada)"]
        end_time = zone.parse(env_time_defined)
      else
        raise "Time Not Defined, falling back"
      end
    rescue
      end_time = 1.year.from_now
    end
    find_by(:id => 1) || create!(:id => 1, :matches => 0, :end_at => end_time)
  end

  def ended?
    ::Time.current > end_at
  end

  def remaining_seconds
    [0, (end_at - ::Time.current).to_i].max
  end

  def running?
    !ended?
  end
end
