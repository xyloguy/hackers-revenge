namespace :db do
  desc "List players"
  task :list_players => :environment do
    ::Rails.logger = ::ActiveSupport::Logger.new($stdout)
    ::Player.order(:place, :score => :desc).each do |p|
      ::Rails.logger.info "#{p.place.inspect} | #{p.score} | #{p.token} | #{p.real_name} | #{p.name} | #{p.email} | #{p.phone}"
    end
  end
end
