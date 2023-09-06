require "rails_helper"

::RSpec.describe ::Instruction, :type => :model do
  describe "validations" do
    describe "line_number" do
      subject { build(:instruction, :line_number => line_number) }

      context "with nil" do
        let(:line_number) { nil }
        it { is_expected.to_not be_valid }
      end

      context "with value" do
        let(:line_number) { 1 }
        it { is_expected.to be_valid }
      end
    end

    describe "opcode" do
      subject { build(:instruction, :opcode => opcode, :argument => 42) }

      context "with valid opcode" do
        let(:opcode) { "PUSH" }
        it { is_expected.to be_valid }
      end

      context "with invalid opcode" do
        let(:opcode) { "PUSHES" }
        it { is_expected.to_not be_valid }
      end
    end

    describe "argument" do
      subject { build(:instruction, :opcode => opcode, :argument => argument) }

      context "with opcode that does not take an argument" do
        let(:opcode) { "NOOP" }

        context "when argument is nil" do
          let(:argument) { nil }
          it { is_expected.to be_valid }
        end

        context "when argument is not nil" do
          let(:argument) { 42 }
          it { is_expected.to_not be_valid }
        end
      end

      context "with opcode that takes an argument" do
        let(:opcode) { "PUSH" }

        context "when argument is nil" do
          let(:argument) { nil }
          it { is_expected.to_not be_valid }
        end

        context "when argument is negative and in range" do
          let(:argument) { -255 }
          it { is_expected.to be_valid }
        end

        context "when argument is positive and in range" do
          let(:argument) { 255 }
          it { is_expected.to be_valid }
        end

        context "when argument is negative and out of range" do
          let(:argument) { -256 }
          it { is_expected.to_not be_valid }
        end

        context "when argument is positive and out of range" do
          let(:argument) { 256 }
          it { is_expected.to_not be_valid }
        end
      end
    end
  end
end
