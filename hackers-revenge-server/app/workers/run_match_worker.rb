# not sure why this isn't getting auto-loaded
require "sidekiq/api"

class RunMatchWorker
  include Sidekiq::Worker

  sidekiq_options :queue => "default", :retry => false

  def self.running
    self.workers.size
  end

  def self.workers
    ::Sidekiq::Workers.new
  end

  def self.queued
    queue = Sidekiq::Queue.new("default")
    queue.count { |job| job.klass == to_s }
  end

  def perform(contender_id)
    ::Match.run!(contender_id)
  end
end
