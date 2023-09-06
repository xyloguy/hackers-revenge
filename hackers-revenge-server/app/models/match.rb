class Match
  BATTLE_MULTIPLIER = 6 # In a match, every participant (contender + top ten) will battle every other participant BATTLE_MULTIPLIER * 2 times.

  # Run a match (several battles) between a given contender and the top ten players.
  # Their scores and places will be updated; last place (11th) will get "knocked out" (place set to nil).
  def self.run!(contender_id)
    fail "Contender #{contender_id} has no program!" if ::Player.find(contender_id).last_program.blank?

    # List of players includes the contender and top ten.
    player_ids = ([contender_id] + ::Player.top_ten.pluck(:id)).uniq
    players = ::Player.where(:id => player_ids).to_a

    # Start out all players with a score of 0.
    players.each(&:reset_points)

    # Prepare list of battles to run.
    battles_to_run = []
    players.each do |player1|
      players.each do |player2|
        next if player1 == player2
        battles_to_run << [player1, player2]
      end
    end

    # Arrange battles in a random order so everyone won't have the same last opponent.
    battles_to_run.shuffle!

    # Run battles!
    BATTLE_MULTIPLIER.times do
      battles_to_run.each do |player1, player2|
        ::Player.run_battle!(player1, player2)
      end
    end

    # Save players with new scores and last_battle.
    # (Note that all battles don't get saved; only the last_battle of each player gets saved.)
    players.each(&:save!)

    # Update players' placements.
    place = 1
    players = ::Player.where(:id => player_ids).order(:score => :desc).to_a
    ::Player.transaction do
      players.each do |player|
        player.update!(:place => (place > 10 ? nil : place))
        place += 1
      end
    end

    # Update matches count.
    ::TournamentInfo.increment_matches
  end
end
