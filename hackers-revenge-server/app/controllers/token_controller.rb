class TokenController < ApplicationController
  before_action :verify_tournament_running

  def show
    @player = ::Player.new_random
    if @player.save
      render :json => { :token => @player.token, :name => @player.name }
    else
      render :json => { :error => @player.errors.full_messages.join("; ") }, :status => :unprocessable_entity
    end
  end

private

  def verify_tournament_running
    return if ::TournamentInfo.instance.running?

    render :json => { :error => "Tournament has ended; no more tokens can be given out" }, :status => :unprocessable_entity
  end
end
