namespace :db do
  desc "Preseed players"
  task :preseed_players => :environment do
    ::Rails.logger = ::ActiveSupport::Logger.new($stdout)

    # Provide a list of name,email to stdin.
    $stdin.each_line do |line|
      line.chomp!

      name, email = line.split(",")
      name.strip!
      email.strip!

      player = ::Player.create!(:token => ::Player.random_token, :email => email, :name => name, :real_name => name)
      ::Rails.logger.info "Created player ##{player.id}: #{player.token}, #{player.name}, #{player.email}"
    end
  end
end
