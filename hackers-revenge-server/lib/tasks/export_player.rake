namespace :db do
  desc "Export player"
  task :export_player, [:id] => :environment do |_t, args|
    id = args[:id]

    ::Rails.logger = ::ActiveSupport::Logger.new($stdout)
    ::ActiveRecord::Base.logger.level = 1

    p = ::Player.find(id)
    player_hash = p.as_json(:only => [:token, :name])
    program_hash = p.last_program.instructions.as_json(:only => [:line_number, :opcode, :argument])
    hash = {
      "player" => player_hash,
      "program" => program_hash
    }
    ::Rails.logger.info ::JSON.pretty_generate(hash)
  end
end
