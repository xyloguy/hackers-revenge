class Instruction < ApplicationRecord
  OPCODE_TAKES_ARG = {
    "NOOP" => false,
    "PUSH" => true,
    "DROP" => false,
    "DUPE" => false,
    "DUPE2" => false,
    "SWAP" => false,
    "INC" => true,
    "ADD" => false,
    "NEGATE" => false,
    "JUMP" => true,
    "JUMPZ" => true,
    "JUMPG" => true,
    "HCF" => false,
    "SCAN" => true,
    "COPY" => true,
    "ICOPY" => true,
    "SETARG" => true,
    "PUSHARG" => false,
    "INCARG" => true,
    "DECSKIP" => true
  }.freeze

  OPCODES = OPCODE_TAKES_ARG.keys.freeze

  belongs_to :program

  validates :line_number, :presence => true
  validates :opcode, :inclusion => { :in => OPCODES }
  validates :argument, :inclusion => { :in => -255..255 }, :allow_nil => true

  validate :arg_present, :if => lambda { OPCODE_TAKES_ARG[opcode] }
  validate :arg_not_present, :if => lambda { OPCODE_TAKES_ARG[opcode] == false }

private

  def arg_present
    errors.add(:argument, "must be provided with opcode #{opcode}") if argument.nil?
  end

  def arg_not_present
    errors.add(:argument, "must not be provided with opcode #{opcode}") unless argument.nil?
  end
end
