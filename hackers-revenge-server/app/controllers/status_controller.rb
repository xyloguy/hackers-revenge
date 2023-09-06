class StatusController < ApplicationController
  def show
    tournament_info = ::TournamentInfo.instance

    render :json => {
      :status => tournament_info.running? ? 0 : 1,
      :remaining_seconds => tournament_info.remaining_seconds,
      :matches => {
        :completed => tournament_info.matches.to_i,
        :running => ::RunMatchWorker.running,
        :queued => ::RunMatchWorker.queued
      }
    }
  end
end
