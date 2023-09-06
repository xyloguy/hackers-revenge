require "rails_helper"

::RSpec.describe ::Program, :type => :model do
  subject { instance }
  let(:instance) { described_class.new(:player => player) }
  let(:player) { build(:player, :name => player_name, :wins => 1, :losses => 2, :ties => 3, :score => -1) }
  let(:player_name) { "Fast Horse" }

  describe "validations" do
    describe "instruction count" do
      before do
        instructions_count.times do
          instance.instructions.build(:line_number => 1, :opcode => "PUSH", :argument => 42)
        end
      end

      context "with max instructions_count" do
        let(:instructions_count) { described_class::MAX_INSTRUCTIONS }
        it { is_expected.to be_valid }
      end

      context "with too many instructions" do
        let(:instructions_count) { described_class::MAX_INSTRUCTIONS + 1 }
        it { is_expected.to_not be_valid }
      end
    end
  end

  describe "callbacks" do
    describe "update_player_last_program_id" do
      let(:player) { create(:player) }
      before { subject.save! }
      it { expect(player.reload.last_program_id).to eq subject.id }
    end
  end

  describe ".build" do
    subject { described_class.build(player, code) }

    let(:code) do
      [
        { :opcode => "NOOP", :arg => nil },
        { :opcode => "PUSH", :arg => 42 }
      ]
    end

    it { is_expected.to be_a ::Program }
    it { expect(subject.persisted?).to eq false }
    it { expect(subject.player).to eq player }
    it { expect(subject.instructions.size).to eq 2 }
    it { expect(subject.instructions[0].opcode).to eq "NOOP" }
    it { expect(subject.instructions[0].argument).to eq nil }
    it { expect(subject.instructions[1].opcode).to eq "PUSH" }
    it { expect(subject.instructions[1].argument).to eq 42 }

    context "sets last_program_id on save" do
      before do
        subject.save!
        subject.reload
      end
      it { expect(subject.player.last_program_id).to eq subject.id }
    end
  end

  describe "#battles" do
    let(:program1) { build(:program) }
    let(:program2) { build(:program) }
    let(:program3) { build(:program) }

    before do
      @battle1 = create(:battle, :program1 => program1, :program2 => program2)
      @battle2 = create(:battle, :program1 => program3, :program2 => program1)
      @battle3 = create(:battle, :program1 => program2, :program2 => program3)
    end

    it do
      expect(program1.battles.count).to eq(2)
      expect(program1.battles).to include(@battle1)
      expect(program1.battles).to include(@battle2)
      expect(program1.battles).not_to include(@battle3)
    end
  end

  describe "#prepared_instructions" do
    subject { instance.prepared_instructions }

    context "when no instructions" do
      it { expect(subject.size).to eq(1) }
      it { expect(subject[0].attributes).to eq(::Instruction.new(:opcode => "HCF").attributes) }
    end

    context "when instructions out of order" do
      let(:instruction1) { build(:instruction, :line_number => 1) }
      let(:instruction2) { build(:instruction, :line_number => 2) }
      let(:instruction3) { build(:instruction, :line_number => 3) }
      before do
        instance.instructions << instruction2
        instance.instructions << instruction3
        instance.instructions << instruction1
      end
      it { expect(subject.size).to eq(3) }
      it { expect(subject[0]).to eq(instruction1) }
      it { expect(subject[1]).to eq(instruction2) }
      it { expect(subject[2]).to eq(instruction3) }
    end
  end

  describe "#to_* methods" do
    before do
      instance.instructions.build(:line_number => 1, :opcode => "PUSH", :argument => 42)
      instance.instructions.build(:line_number => 2, :opcode => "DUPE", :argument => nil)
      instance.instructions.build(:line_number => 3, :opcode => "COPY", :argument => 7)
    end

    describe "#to_code_array_for_build" do
      subject { instance.to_code_array_for_build }
      let(:expected) do
        [
          { :opcode => "PUSH", :arg => 42 },
          { :opcode => "DUPE", :arg => nil },
          { :opcode => "COPY", :arg => 7 }
        ]
      end

      it { is_expected.to eq(expected) }
    end

    describe "#to_hash_for_journal" do
      subject { instance.to_hash_for_journal(start_ip) }
      let(:start_ip) { 200 }
      let(:expected) do
        {
          :player_name => player_name,
          :start_ip => start_ip,
          :code => [
            { :addr => start_ip, :opcode => "PUSH", :arg => 42 },
            { :addr => start_ip + 1, :opcode => "DUPE", :arg => nil },
            { :addr => start_ip + 2, :opcode => "COPY", :arg => 7 }
          ]
        }
      end

      it { is_expected.to eq(expected) }
    end
  end
end
