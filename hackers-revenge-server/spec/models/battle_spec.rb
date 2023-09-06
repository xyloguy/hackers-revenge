require "rails_helper"

::RSpec.describe ::Battle, :type => :model do
  subject { instance }
  let(:instance) { build(:battle, :program1 => program1, :program2 => program2) }

  let(:program1) { ::Program.build(player1, code1) }
  let(:program2) { ::Program.build(player2, code2) }

  let(:player1) { build(:player) }
  let(:player2) { build(:player) }

  let(:code1) { [{ :opcode => "NOOP", :arg => nil }, { :opcode => "JUMP", :arg => -1 }] }
  let(:code2) { [{ :opcode => "HCF", :arg => nil }] }

  describe "#run!" do
    subject { instance.run! }

    it "updates winner" do
      expect { subject }.to change(instance, :winner).from(nil).to("winner1")
    end

    it "adds rounds" do
      expect { subject }.to change { instance.rounds.size }.from(0).to(::Battle::MAX_ROUNDS)
    end

    it "sets correct round numbers" do
      subject
      expect(instance.rounds[0].round_number).to eq 1
      expect(instance.rounds[1].round_number).to eq 2
      expect(instance.rounds[2].round_number).to eq 3
      expect(instance.rounds[3].round_number).to eq 4
    end

    it "alternates first player" do
      subject
      expect(instance.rounds[0].first_player).to eq 1
      expect(instance.rounds[1].first_player).to eq 2
      expect(instance.rounds[2].first_player).to eq 1
      expect(instance.rounds[3].first_player).to eq 2
    end

    context "when a program is missing" do
      let(:program2) { nil }
      it { expect { subject }.to raise_error(::ActiveRecord::RecordInvalid) }
    end
  end
end
