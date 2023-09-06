class LeaderboardController < ApplicationController
  def show
    render :json => ::Player.to_leaderboard_hash(:show_real_names => show_real_names?)
  end
end
