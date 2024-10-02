class LeaderboardController < ApplicationController
  def show
    render :json => ::Player.to_leaderboard_hash
  end
end
