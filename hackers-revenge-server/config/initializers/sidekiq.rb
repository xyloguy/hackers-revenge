sidekiq_config = ::YAML.load_file(::Rails.root.join("config", "sidekiq.yml")).fetch(::Rails.env)

::Sidekiq.configure_server do |config|
  config.redis = sidekiq_config.deep_symbolize_keys

  # Make sure any rails logging goes to the sidekiq logger.
  ::Rails.logger = ::Sidekiq.logger

  # Check redis often for scheduled and retriable jobs
  config.average_scheduled_poll_interval = 1
end

::Sidekiq.configure_client do |config|
  config.redis = sidekiq_config.deep_symbolize_keys
end
