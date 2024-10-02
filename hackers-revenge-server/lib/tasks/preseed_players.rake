namespace :db do
  desc "Preseed players"
  task :preseed_players => :environment do
    ::Rails.logger = ::ActiveSupport::Logger.new($stdout)

    # Provide a list of name,token to stdin.
    $stdin.each_line do |line|
      line.chomp!

      name, token = line.split(",")
      name.strip!
      token.strip!

      player = ::Player.create!(:token => token, :name => name)
      ::Rails.logger.info "Created player ##{player.id}: #{player.token}, #{player.name}"
    end
  end
end
