namespace :db do
  desc "Send texts"
  task :send_texts => :environment do
    ::Rails.logger = ::ActiveSupport::Logger.new($stdout)
    ::Player.where.not(:phone => nil).order(:place, :score).each do |p|
      extra = " ** you are currently in the top ten **" if p.place.to_i >= 1 && p.place.to_i <= 10
      ::Rails.logger.info "sms_send \"#{p.phone}\" \"Hello #{p.name}; the MX hackathon tournament ends at 3:00pm and winners will be announced at 3:05pm; winners must be present in person at the MX booth to win a prize#{extra}\""
    end
  end
end
