require "rails_helper"

::RSpec.describe ::Cycle, :type => :model do
  subject { instance }
  let(:instance) { described_class.new(**attrs) }
  let(:attrs) do
    {
      :cycle_number => cycle_number,
      :program_number => program_number,
      :status => status,
      :opcode => opcode,
      :argument => argument,
      :old_ip => old_ip,
      :new_ip => new_ip,
      :old_stack => old_stack,
      :new_stack => new_stack,
      :read_addr_first => read_addr_first,
      :read_addr_last => read_addr_last,
      :writes => writes
    }
  end
  let(:cycle_number) { 1 }
  let(:program_number) { 2 }
  let(:status) { ::Cycle::STATUS_DIED_STACK_OVERFLOW }
  let(:opcode) { "COPY" }
  let(:argument) { 7 }
  let(:old_ip) { 128 }
  let(:new_ip) { 129 }
  let(:old_stack) { "15,33,61" }
  let(:new_stack) { "15,33" }
  let(:read_addr_first) { 15 }
  let(:read_addr_last) { 16 }
  let(:writes) { [{ :addr => write_addr, :opcode => write_opcode, :argument => write_argument }] }
  let(:write_addr) { 189 }
  let(:write_opcode) { "PUSH" }
  let(:write_argument) { 42 }

  describe "#to_hash_for_journal" do
    subject { instance.to_hash_for_journal }
    let(:expected) do
      {
        :cycle => cycle_number,
        :program => program_number,
        :status => status,
        :opcode => opcode,
        :arg => argument,
        :old_ip => old_ip,
        :new_ip => new_ip,
        :old_stack => old_stack,
        :new_stack => new_stack,
        :read_addr_first => read_addr_first,
        :read_addr_last => read_addr_last,
        :writes => writes_array
      }
    end
    let(:writes_array) { [write_hash] }
    let(:write_hash) do
      {
        :addr => write_addr,
        :opcode => write_opcode,
        :arg => write_argument
      }
    end

    context "when write_* are present (COPY an instruction)" do
      it { is_expected.to eq(expected) }
    end

    context "when write_argument is missing (COPY an instruction that doesn't take an arg)" do
      let(:write_argument) { nil }
      it { is_expected.to eq(expected) }
    end

    context "when write_opcode and write_argument are missing (COPY a nil)" do
      let(:write_opcode) { nil }
      let(:write_argument) { nil }
      let(:write_hash) do
        {
          :addr => write_addr
        }
      end

      it { is_expected.to eq(expected) }
    end

    context "when write_opcode is missing (REPLACE)" do
      let(:write_opcode) { nil }
      let(:write_hash) do
        {
          :addr => write_addr,
          :arg => write_argument
        }
      end

      it { is_expected.to eq(expected) }
    end

    context "when write_* are missing (shouldn't happen)" do
      let(:write_addr) { nil }
      let(:write_opcode) { nil }
      let(:write_argument) { nil }
      let(:writes_array) { [] }

      it { is_expected.to eq(expected) }
    end

    context "when writes is missing (most opcodes)" do
      let(:writes) { nil }

      it { is_expected.to eq(expected.without(:writes)) }
    end

    context "when multiple writes (COPY an HCF onto an HCF)" do
      let(:writes) do
        [
          { :addr => write_addr - 1, :opcode => "HCF", :argument => nil },
          { :addr => write_addr + 0, :opcode => "HCF", :argument => nil },
          { :addr => write_addr + 1, :opcode => "HCF", :argument => nil }
        ]
      end
      let(:writes_array) do
        [
          { :addr => write_addr - 1, :opcode => "HCF", :arg => nil },
          { :addr => write_addr + 0, :opcode => "HCF", :arg => nil },
          { :addr => write_addr + 1, :opcode => "HCF", :arg => nil }
        ]
      end

      it { is_expected.to eq(expected) }
    end
  end
end
