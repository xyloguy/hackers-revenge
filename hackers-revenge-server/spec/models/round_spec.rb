require "rails_helper"

::RSpec.describe ::Round, :type => :model do
  subject { build(:round) }

  describe "validations" do
    describe "round_number" do
      subject { build(:round, :round_number => round_number) }

      context "with nil" do
        let(:round_number) { nil }
        it { is_expected.to_not be_valid }
      end

      context "with value" do
        let(:round_number) { 1 }
        it { is_expected.to be_valid }
      end
    end

    describe "program1_start_ip" do
      subject { build(:round, :program1_start_ip => program1_start_ip) }

      context "with nil" do
        let(:program1_start_ip) { nil }
        it { is_expected.to_not be_valid }
      end

      context "with value" do
        let(:program1_start_ip) { 0 }
        it { is_expected.to be_valid }
      end
    end

    describe "program2_start_ip" do
      subject { build(:round, :program2_start_ip => program2_start_ip) }

      context "with nil" do
        let(:program2_start_ip) { nil }
        it { is_expected.to_not be_valid }
      end

      context "with value" do
        let(:program2_start_ip) { 0 }
        it { is_expected.to be_valid }
      end
    end
  end

  context "building and running a test round" do
    subject { described_class.build_for_test(:player1_name => player1_name, :player2_name => player2_name, :program1_code => program1_code, :program2_code => program2_code) }
    let(:player1_name) { "Fun George" }
    let(:player2_name) { "Happy Joe" }
    let(:program1_code) do
      [
        { :opcode => "NOOP", :arg => nil },
        { :opcode => "JUMP", :arg => -1 }
      ]
    end
    let(:program2_code) do
      [
        { :opcode => "PUSH", :arg => 42 },
        { :opcode => "NOOP", :arg => nil },
        { :opcode => "HCF", :arg => nil }
      ]
    end

    describe ".build_for_test" do
      it { is_expected.to be_a(::Round) }
      it { expect(subject.battle.program1).to be_a(::Program) }
      it { expect(subject.battle.program2).to be_a(::Program) }
      it { expect(subject.battle.program1.instructions.size).to eq(2) }
      it { expect(subject.battle.program2.instructions.size).to eq(3) }
      it { expect(subject.battle.program1.player.name).to eq(player1_name) }
      it { expect(subject.battle.program2.player.name).to eq(player2_name) }
      it { expect(subject.program1_start_ip).to be_between(0, 255) }
      it { expect(subject.program2_start_ip).to be_between(0, 255) }
    end

    describe "#run! and #to_journal_hash" do
      let(:expected_journal_hash) do
        {
          :program1 => {
            :player_name => "Fun George",
            :start_ip => 0,
            :code => [
              { :addr => 0, :arg => nil, :opcode => "NOOP" },
              { :addr => 1, :arg => -1, :opcode => "JUMP" }
            ]
          },
          :program2 => {
            :player_name => "Happy Joe",
            :start_ip => 128,
            :code => [
              { :addr => 128, :arg => 42, :opcode => "PUSH" },
              { :addr => 129, :arg => nil, :opcode => "NOOP" },
              { :addr => 130, :arg => nil, :opcode => "HCF" }
            ]
          },
          :journal => [
            { :cycle => 1, :program => 1, :status => 0, :opcode => "NOOP", :arg => nil, :old_ip => 0,   :new_ip => 1,   :old_stack => "", :new_stack => "",     :read_addr_first => nil, :read_addr_last => nil },
            { :cycle => 1, :program => 2, :status => 0, :opcode => "PUSH", :arg => 42,  :old_ip => 128, :new_ip => 129, :old_stack => "", :new_stack => "42",   :read_addr_first => nil, :read_addr_last => nil },
            { :cycle => 2, :program => 1, :status => 0, :opcode => "JUMP", :arg => -1,  :old_ip => 1,   :new_ip => 0,   :old_stack => "", :new_stack => "",     :read_addr_first => nil, :read_addr_last => nil },
            { :cycle => 2, :program => 2, :status => 0, :opcode => "NOOP", :arg => nil, :old_ip => 129, :new_ip => 130, :old_stack => "42", :new_stack => "42", :read_addr_first => nil, :read_addr_last => nil },
            { :cycle => 3, :program => 1, :status => 0, :opcode => "NOOP", :arg => nil, :old_ip => 0,   :new_ip => 1,   :old_stack => "", :new_stack => "",     :read_addr_first => nil, :read_addr_last => nil },
            { :cycle => 3, :program => 2, :status => 3, :opcode => "HCF",  :arg => nil, :old_ip => 130, :new_ip => 130, :old_stack => "42", :new_stack => "42", :read_addr_first => nil, :read_addr_last => nil }
          ],
          :winner => 1
        }
      end

      before do
        subject.program1_start_ip = 0
        subject.program2_start_ip = 128
        subject.run!
      end

      it { expect(subject.winner).to eq("winner1") }
      it { expect(subject.to_journal_hash).to eq(expected_journal_hash) }
    end
  end

  # I admit, this test isn't great.
  describe "#randomize_start_ips" do
    subject { build(:round, :program1_start_ip => nil, :program2_start_ip => nil) }
    before { subject.randomize_start_ips }
    it { expect(subject.program1_start_ip).to be_between(0, 255) }
    it { expect(subject.program2_start_ip).to be_between(0, 255) }
  end

  describe "#run" do
    context "with a program that has invalid instructions" do
      before { subject.battle.program2.instructions = [build(:instruction, :opcode => "PUSH", :argument => nil)] }
      it { is_expected.to_not be_valid }
      it "has correct validation errors" do
        subject.validate
        expect(subject.errors.full_messages).to include("Battle program2 instructions[0] argument must be provided with opcode PUSH")
      end
    end

    # TODO
  end
end
