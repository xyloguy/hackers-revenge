class TournamentInfo < ApplicationRecord
  # Ensure only one row can ever exist, the one created by calling instance.
  validates :id, :inclusion => { :in => [1] }

  def self.increment_matches
    increment_counter(:matches, 1, :touch => true) # rubocop:disable Rails/SkipsModelValidations
  end

  def self.instance
    find_by(:id => 1) || create!(:id => 1, :matches => 0, :end_at => 1.year.from_now)
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
