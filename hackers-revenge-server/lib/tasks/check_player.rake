namespace :db do
  desc "Check player"
  task :check_player, [:i] => :environment do |_t, args|
    t = args[:i]

    ::Rails.logger = ::ActiveSupport::Logger.new($stdout)
    ::ActiveRecord::Base.logger.level = 1

    # try to find by ID first, fallback to token
    begin
      p = ::Player.find(t)
    rescue ActiveRecord::RecordNotFound
      p = ::Player.find_by(:token => t)
    end

    if p.present?
      player_hash = p.as_json(:only => [:token, :name])
      program = {
        "submitted" => p.last_program.present?,
        "score" => p.score * 100,
        "place" => p.place,
      }
    else
      player_hash = 'Not Found'
      program = 'Player not found'
    end

    hash = {
      "player" => player_hash,
      "program" => program,
    }
    ::Rails.logger.info ::JSON.pretty_generate(hash)
  end
end
