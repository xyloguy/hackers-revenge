class TestRoundController < ApplicationController
  def create
    @round = ::Round.build_for_test(create_params)
    if @round.run
      render :json => @round.to_journal_hash
    else
      render :json => { :error => @round.errors.full_messages.join("; ") }, :status => :unprocessable_entity
    end
  end

private

  def create_params
    {
      :player1_name => params.require(:program1).require(:player_name),
      :player2_name => params.require(:program2).require(:player_name),
      :program1_code => params.require(:program1).permit("code" => [:opcode, :arg]).require("code"),
      :program2_code => params.require(:program2).permit("code" => [:opcode, :arg]).require("code")
    }
  end
end
