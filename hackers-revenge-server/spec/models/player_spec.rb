require "rails_helper"

::RSpec.describe ::Player, :type => :model do
  describe "callbacks" do
    describe "default_points" do
      subject { described_class.create!(:token => "abc", :name => "Happy Fox") }
      it { expect(subject.wins).to eq(0) }
      it { expect(subject.losses).to eq(0) }
      it { expect(subject.ties).to eq(0) }
      it { expect(subject.score).to eq(0) }
    end

    describe "adjust_score" do
      let(:wins) { 5 }
      let(:ties) { 3 }
      let(:losses) { 1000 }
      subject { create(:player, :wins => wins, :ties => ties, :losses => losses) }
      it { expect(subject.score).to eq((wins * 2) + ties) }
    end
  end

  describe ".new_random" do
    it { expect(described_class.new_random).to be_a(::Player) }
    it { expect(described_class.new_random.token.size).to be >= 8 }
    it { expect(described_class.new_random.name.size).to be >= 5 }
  end

  describe ".random_name" do
    it { expect(described_class.random_name.size).to be >= 3 }
  end

  describe ".random_token" do
    it { expect(described_class.random_token.size).to be >= 8 }

    it "is all lowercase" do
      token = described_class.random_token
      expect(token).to eq(token.downcase)
    end
  end

  describe "#reset_points" do
    subject { build(:player, :wins => 1, :losses => 2, :ties => 3, :score => -1) }

    it { expect { subject.reset_points }.to change(subject, :wins).to(0) }
    it { expect { subject.reset_points }.to change(subject, :losses).to(0) }
    it { expect { subject.reset_points }.to change(subject, :ties).to(0) }
    it { expect { subject.reset_points }.to change(subject, :score).to(0) }
  end
end
