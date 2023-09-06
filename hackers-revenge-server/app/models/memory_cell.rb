class MemoryCell
  attr_reader :opcode # string like "PUSH" or "JUMP"
  attr_accessor :argument # integer in range -255 to +255
  attr_accessor :program_num # 1 or 2

  def self.new_no_opcode(argument:, program_num:)
    new(:opcode => nil, :argument => argument, :program_num => program_num, :validate_args => false)
  end

  def initialize(opcode:, argument:, program_num:, validate_args: true)
    if validate_args
      fail "MemoryCell: Invalid opcode" unless ::Instruction::OPCODES.include?(opcode)
      fail "MemoryCell: Arg too big" if argument.to_i > 255
      fail "MemoryCell: Arg too small" if argument.to_i < -255
    end

    @opcode = opcode
    @argument = argument
    @program_num = program_num.to_i
  end

  def hcf?
    opcode == "HCF"
  end

  def inc_argument(value)
    @argument = @argument.to_i + value.to_i
  end
end
