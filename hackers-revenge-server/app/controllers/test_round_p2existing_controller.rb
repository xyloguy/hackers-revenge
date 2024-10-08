class TestRoundP2existingController < ApplicationController
  GUARDIAN_NAMES = ["MX R3ckl3ss", "MX Sc4r3dy C4t", "MX Sl0w F1r3", "MX Sc4nn3r"].freeze

  before_action :find_player2
  before_action :find_program2

  def create
    create_params
    @round = ::Round.build_for_test(
      :player1_name => @player1_name,
      :player2_name => @player2_name,
      :program1_code => @program1_code,
      :program2_code => @program2_code,
    )
    if @round.run
      render :json => @round.to_journal_hash(:filter_p2 => filter_p2?)
    else
      render :json => { :error => @round.errors.full_messages.join("; ") }, :status => :unprocessable_entity
    end
  end

private

  def create_params
      @player2_name = @player2.name
      @program2_code = @program2.to_code_array_for_build
      @player1_name = params.dig(:program1, :player_name)
      @program1_code = params.require(:program1).permit(:player_name, :code => [:opcode, :arg]).require(:code)
  end

  def filter_p2?
    p2_guardian?
  end

  def find_player2
    @player2_token = params.dig(:program2, :player_token)
    @player2_name = params.dig(:program2, :player_name)

    if @player2_token.present?
      find_player2_from_token
    elsif @player2_name.present?
      find_player2_from_name
    else
      render :json => { :error => "Player 2 not found; must provide token or name" }, :status => :unprocessable_entity
    end
  end

  def find_player2_from_name
    unless GUARDIAN_NAMES.include?(@player2_name)
      render :json => { :error => "Player 2 not found; invalid guardian name" }, :status => :unprocessable_entity
      return
    end

    @player2 = ::Player.find_by(:name => @player2_name)
    return if @player2.present?

    render :json => { :error => "Player 2 guardian not found; has the db been seeded?" }, :status => :unprocessable_entity
  end

  def find_player2_from_token
    @player2 = ::Player.find_by(:token => @player2_token)
    return if @player2.present?

    render :json => { :error => "Player 2 not found; invalid token" }, :status => :unprocessable_entity
  end

  def find_program2
    @program2 = @player2.last_program
    return if @program2.present?

    render :json => { :error => "Player 2 has no last program" }, :status => :unprocessable_entity
  end

  def p2_guardian?
    GUARDIAN_NAMES.include?(@player2.name)
  end
end
