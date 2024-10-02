class ProgramController < ApplicationController
  MAX_PROGRAMS_PER_PLAYER = Integer(ENV['MAX_PROGRAMS_PER_PLAYER']  || 8)
  GENERIC_AUTH_ERROR = "Invalid token".freeze

  before_action :find_player
  before_action :verify_tournament_running
  before_action :limit_submissions

  def create
    @program = ::Program.build(@player, code)
    if @program.save
      ::RunMatchWorker.perform_async(@player.id)
      render :json => { :programs_submitted => player_program_count, :programs_remaining => MAX_PROGRAMS_PER_PLAYER - player_program_count, :player_name => player_name }
    else
      render :json => { :error => @program.errors.full_messages.join("; ") }, :status => :unprocessable_entity
    end
  end

private

  def code
    @code ||= params.permit("code" => [:opcode, :arg]).require("code")
  end

  def find_player
    @player = ::Player.find_by(:token => token)
    return if @player.present?

    render :json => { :error => GENERIC_AUTH_ERROR }, :status => :unauthorized # "Invalid token"
  end

  def limit_submissions
    return if @player.programs.count < MAX_PROGRAMS_PER_PLAYER

    render :json => { :error => "No more programs may be submitted (max #{MAX_PROGRAMS_PER_PLAYER})" }, :status => :unprocessable_entity
  end

  def player_name
    @player.name
  end

  def player_program_count
    @player_program_count ||= @player.programs.count
  end

  def token
    @token ||= params.require("token").downcase
  end

  def verify_tournament_running
    return if ::TournamentInfo.instance.running?

    render :json => { :error => "Tournament has ended; no more programs may be submitted" }, :status => :unprocessable_entity
  end
end
