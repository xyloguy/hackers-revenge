class RoundController < ApplicationController
  def show
    @round = ::Round.find_by(:battle_id => params.require("battle_id"), :round_number => params.require("round_num"))
    if @round.present?
      if @round.run
        render :json => @round.to_journal_hash
      else
        render :json => { :error => @round.errors.full_messages.join("; ") }, :status => :unprocessable_entity
      end
    else
      render :json => { :error => "Round Not Found" }, :status => :not_found
    end
  end
end
