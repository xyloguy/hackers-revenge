namespace :db do
  desc "Import player"
  task :import_player => :environment do
    ::Rails.logger = ::ActiveSupport::Logger.new($stdout)

    json = $stdin.read
    hash = ::JSON.parse(json)

    player = ::Player.new(hash["player"])
    program = ::Program.new(:player => player)
    hash["program"].each do |inst|
      program.instructions.build(inst)
    end
    program.save!

    ::Rails.logger.info "Player #{player.id} imported"
  end
end
