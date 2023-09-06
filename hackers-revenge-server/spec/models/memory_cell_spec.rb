require "rails_helper"

::RSpec.describe ::MemoryCell do
  subject { ::MemoryCell.new(:opcode => opcode, :argument => argument, :program_num => program_num) }
  let(:opcode) { "PUSH" }
  let(:argument) { 255 }
  let(:program_num) { 2 }

  describe "initialize" do
    it { expect(subject.opcode).to eq(opcode) }
    it { expect(subject.argument).to eq(argument) }
    it { expect(subject.program_num).to eq(program_num) }
    it { expect(subject.hcf?).to eq(false) }

    context "with HCF" do
      let(:opcode) { "HCF" }
      let(:argument) { nil }
      it { expect(subject.hcf?).to eq(true) }
    end
  end
end
