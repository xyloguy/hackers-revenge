require "rails_helper"

::RSpec.describe ::RunMatchWorker, :type => :worker do
  describe "perform" do
    let(:contender_id) { 1 }

    it "calls Match.run!" do
      expect(::Match).to receive(:run!).with(contender_id)
      subject.perform(contender_id)
    end
  end
end
