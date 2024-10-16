class RunningProgram
  MAX_STACK_SIZE = 16

  # Prevent enormous numbers from being concocted (e.g., via DUPE ; ADD ; JUMP -2).
  MIN_ARG_VALUE = -1_000_000
  MAX_ARG_VALUE = 1_000_000

  attr_reader :program_num # 1 or 2
  attr_reader :memory # array of MemoryCell
  attr_reader :stack # array of integers
  attr_reader :ip # current instruction pointer (in 0..255)

  # After calling run_next_instruction, these tell you what ip and stack were before it was called.
  attr_reader :old_stack
  attr_reader :old_ip

  # After calling run_next_instruction, these tell you which opcode (and arg) was just ran.
  attr_reader :ran_opcode
  attr_reader :ran_argument

  # After calling run_next_instruction, these tell you which addresses were just read/written to.
  attr_reader :read_addr_first
  attr_reader :read_addr_last
  attr_reader :wrotes # array of hashes containing :addr, :opcode, and :argument; yes, I know wrotes isn't a word

  def initialize(program_num, memory, start_ip, instructions)
    fail "RunningProgram: No instructions" if instructions.size.zero?
    fail "RunningProgram: Too many instructions" if instructions.size > ::Program::MAX_INSTRUCTIONS

    @program_num = program_num.to_i
    @memory = memory
    @stack = []
    @ip = start_ip % 256

    @old_stack = stack.dup
    @old_ip = ip.dup
    @ran_opcode = @ran_argument = nil
    @read_addr_first = @read_addr_last = @wrotes = nil

    load_to_memory(instructions)
  end

  # Return value is the running status (see status enum in Cycle).
  def run_next_instruction
    @old_stack = stack.dup
    @old_ip = ip.dup
    @ran_opcode = @ran_argument = nil
    @read_addr_first = @read_addr_last = @wrotes = nil

    inst = memory[ip]
    return ::Cycle::STATUS_DIED_EXECUTING_NIL if inst.nil? || inst.opcode.nil?

    @ran_opcode = inst.opcode
    @ran_argument = inst.argument

    return ::Cycle::STATUS_DIED_ARG_OVERFLOW if arg < MIN_ARG_VALUE || arg > MAX_ARG_VALUE

    case @ran_opcode
    when "NOOP" then run_noop
    when "PUSH" then run_push
    when "DROP" then run_drop
    when "DUPE" then run_dupe
    when "DUPE2" then run_dupe2
    when "SWAP" then run_swap
    when "INC" then run_inc
    when "ADD" then run_add
    when "SUBTRACT" then run_subtract
    when "DIVIDE" then run_divide
    when "MULTIPLY" then run_multiply
    when "GT" then run_gt
    when "LT" then run_lt
    when "NEGATE" then run_negate
    when "JUMP" then run_jump
    when "JUMPZ" then run_jumpz
    when "JUMPG" then run_jumpg
    when "HCF" then run_hcf(inst)
    when "USCAN" then run_uscan
    when "SCAN" then run_scan
    when "COPY" then run_copy
    when "ICOPY" then run_copy(:indirect => true)
    when "SETARG" then run_setarg
    when "PUSHARG" then run_pusharg
    when "INCARG" then run_incarg
    when "DECSKIP" then run_decskip
    else ::Cycle::STATUS_DIED_INVALID_OPCODE
    end
  end

private

  def arg
    @ran_argument.to_i
  end

  def inc_ip
    @ip = (@ip + 1) % 256
    ::Cycle::STATUS_RUNNING
  end

  def load_to_memory(instructions)
    pos = ip
    instructions.each do |inst|
      memory[pos] = ::MemoryCell.new(:opcode => inst.opcode, :argument => inst.argument, :program_num => program_num)
      pos = (pos + 1) % 256
    end
  end

  def run_add
    return ::Cycle::STATUS_DIED_STACK_UNDERFLOW if stack.size < 2
    value = stack.pop + stack.pop
    return ::Cycle::STATUS_DIED_ARG_OVERFLOW if value < MIN_ARG_VALUE || value > MAX_ARG_VALUE
    stack << (value % 256)
    inc_ip
  end

  def run_subtract
    return ::Cycle::STATUS_DIED_STACK_UNDERFLOW if stack.size < 2
    arg1 = stack.pop
    arg2 = stack.pop
    value = arg2 - arg1
    return ::Cycle::STATUS_DIED_ARG_OVERFLOW if value < MIN_ARG_VALUE || value > MAX_ARG_VALUE
    stack << (value % 256)
    inc_ip
  end

  def run_divide
    return ::Cycle::STATUS_DIED_STACK_UNDERFLOW if stack.empty?
    arg2 = arg
    if arg2 == 0
      pass
    else
      arg1 = stack.pop
      value = arg1 / arg2
      return ::Cycle::STATUS_DIED_ARG_OVERFLOW if value < MIN_ARG_VALUE || value > MAX_ARG_VALUE
      stack << (value % 256)
    end
    inc_ip
  end

  def run_multiply
    return ::Cycle::STATUS_DIED_STACK_UNDERFLOW if stack.empty?
    arg2 = arg
    if arg2 == 0
      pass
    else
      arg1 = stack.pop
      value = arg1 * arg2
      return ::Cycle::STATUS_DIED_ARG_OVERFLOW if value < MIN_ARG_VALUE || value > MAX_ARG_VALUE
      stack << (value % 256)
    end
    inc_ip
  end

  def run_gt
    return ::Cycle::STATUS_DIED_STACK_UNDERFLOW if stack.empty?
    stack << (stack.pop > arg ? 1 : 0)
    inc_ip
  end

  def run_lt
    return ::Cycle::STATUS_DIED_STACK_UNDERFLOW if stack.empty?
    stack << (stack.pop < arg ? 1 : 0)
    inc_ip
  end

  def run_copy(indirect: false)
    return ::Cycle::STATUS_DIED_STACK_UNDERFLOW if stack.empty?
    src_pos = (ip + arg) % 256
    dst_pos = (ip + stack.pop) % 256
    dst_pos = (dst_pos + memory[dst_pos]&.argument.to_i) % 256 if indirect
    explosion = memory[src_pos]&.hcf? && memory[dst_pos]&.hcf?
    memory[dst_pos] = memory[src_pos]

    @read_addr_first = @read_addr_last = src_pos
    wrote = { :addr => dst_pos }
    unless memory[dst_pos].nil?
      wrote[:opcode] = memory[dst_pos].opcode
      wrote[:argument] = memory[dst_pos].argument
    end
    @wrotes = [wrote]

    if explosion
      dst_pos_before = (dst_pos + 255) % 256
      # spread fire to all neighboring fire
      while memory[dst_pos_before]&.hcf?
        dst_pos_before += 255
        dst_pos_before %= 256
      end

      dst_pos_after = (dst_pos + 1) % 256
      # spread fire to all neighboring fire
      while memory[dst_pos_after]&.hcf?
        dst_pos_after += 1
        dst_pos_after %= 256
      end
      memory[dst_pos_before] = memory[dst_pos_after] = memory[dst_pos]

      @wrotes = [wrote.dup, wrote.dup, wrote.dup]
      @wrotes[0][:addr] = dst_pos_before
      @wrotes[2][:addr] = dst_pos_after
    end

    inc_ip
  end

  def run_decskip
    pos = (ip + arg) % 256

    if memory[pos].nil?
      memory[pos] = ::MemoryCell.new_no_opcode(:argument => -1, :program_num => program_num)
    else
      memory[pos].inc_argument(-1)
      memory[pos].program_num = program_num
    end

    @wrotes = [{ :addr => pos, :argument => memory[pos].argument }]

    inc_ip if memory[pos].argument.zero?
    inc_ip
  end

  def run_drop
    return ::Cycle::STATUS_DIED_STACK_UNDERFLOW if stack.empty?
    stack.pop
    inc_ip
  end

  def run_dupe
    return ::Cycle::STATUS_DIED_STACK_UNDERFLOW if stack.empty?
    return ::Cycle::STATUS_DIED_STACK_OVERFLOW if stack.size >= MAX_STACK_SIZE
    stack << stack[-1]
    inc_ip
  end

  def run_dupe2
    return ::Cycle::STATUS_DIED_STACK_UNDERFLOW if stack.empty?
    return ::Cycle::STATUS_DIED_STACK_OVERFLOW if stack.size >= MAX_STACK_SIZE
    stack << stack[-1]
    return ::Cycle::STATUS_DIED_STACK_OVERFLOW if stack.size >= MAX_STACK_SIZE
    stack << stack[-1]
    inc_ip
  end

  def run_hcf(inst)
    if inst.program_num == program_num
      ::Cycle::STATUS_DIED_EXECUTING_OWN_HCF
    else
      ::Cycle::STATUS_DIED_EXECUTING_ENEMY_HCF
    end
  end

  def run_inc
    return ::Cycle::STATUS_DIED_STACK_UNDERFLOW if stack.empty?
    stack[-1] += arg
    inc_ip
  end

  def run_jump
    return ::Cycle::STATUS_DIED_JUMP_0 if arg.zero?
    @ip = (@ip + arg) % 256
    ::Cycle::STATUS_RUNNING
  end

  def run_jumpg
    return ::Cycle::STATUS_DIED_STACK_UNDERFLOW if stack.empty?
    if stack.pop.positive?
      run_jump
    else
      inc_ip
    end
  end

  def run_jumpz
    return ::Cycle::STATUS_DIED_STACK_UNDERFLOW if stack.empty?
    if stack.pop.zero?
      run_jump
    else
      inc_ip
    end
  end

  def run_negate
    return ::Cycle::STATUS_DIED_STACK_UNDERFLOW if stack.empty?
    stack[-1] *= -1
    inc_ip
  end

  def run_noop
    inc_ip
  end

  def run_push
    return ::Cycle::STATUS_DIED_STACK_OVERFLOW if stack.size >= MAX_STACK_SIZE
    stack << arg
    inc_ip
  end

  def run_setarg
    return ::Cycle::STATUS_DIED_STACK_UNDERFLOW if stack.empty?
    value = stack.pop
    pos = (ip + arg) % 256

    if memory[pos].nil?
      memory[pos] = ::MemoryCell.new_no_opcode(:argument => value, :program_num => program_num)
    else
      memory[pos].argument = value
      memory[pos].program_num = program_num
    end

    @wrotes = [{ :addr => pos, :argument => value }]

    inc_ip
  end

  def run_pusharg
    return ::Cycle::STATUS_DIED_STACK_UNDERFLOW if stack.empty?
    pos = (ip + stack.pop) % 256
    value = memory[pos]&.argument.to_i
    stack << value
    inc_ip
  end

  def run_incarg
    return ::Cycle::STATUS_DIED_STACK_UNDERFLOW if stack.empty?
    pos = (ip + stack.pop) % 256

    if memory[pos].nil?
      memory[pos] = ::MemoryCell.new_no_opcode(:argument => arg, :program_num => program_num)
    else
      memory[pos].inc_argument(arg)
      memory[pos].program_num = program_num
    end

    @wrotes = [{ :addr => pos, :argument => memory[pos].argument }]

    inc_ip
  end

  def run_uscan
    return ::Cycle::STATUS_DIED_STACK_UNDERFLOW if stack.empty?
    v = stack.pop
    pos = (ip + v) % 256
    count = arg
    inc_val = count
    inst_found = nil

    @read_addr_first = pos unless count.zero?
    while count != 0
      inst_found = memory[pos]
      break unless inst_found.nil? || inst_found.opcode.nil?

      if count.positive?
        pos = (pos + 1) % 256 # ++pos
        count -= 1
      else
        pos = (pos + 255) % 256 # --pos
        count += 1
      end
    end
    @read_addr_last = pos if @read_addr_first.present?

    # Reverse first and last when scan was backwards.
    if arg.negative?
      @read_addr_first, @read_addr_last = @read_addr_last, @read_addr_first
    end

    if inst_found.nil? || inst_found.opcode.nil? || inst_found.hcf?
      v += inc_val
    else
      v -= 1
    end
    stack << v
    inc_ip
  end

  def run_scan
    return ::Cycle::STATUS_DIED_STACK_UNDERFLOW if stack.empty?
    pos = (ip + stack.pop) % 256
    count = arg
    inst_found = nil

    @read_addr_first = pos unless count.zero?
    while count != 0
      inst_found = memory[pos]
      break unless inst_found.nil? || inst_found.opcode.nil?

      if count.positive?
        pos = (pos + 1) % 256 # ++pos
        count -= 1
      else
        pos = (pos + 255) % 256 # --pos
        count += 1
      end
    end
    @read_addr_last = pos if @read_addr_first.present?

    # Reverse first and last when scan was backwards.
    if arg.negative?
      @read_addr_first, @read_addr_last = @read_addr_last, @read_addr_first
    end

    if inst_found.nil? || inst_found.opcode.nil?
      stack << 0
    elsif inst_found.hcf?
      stack << -1
    else
      stack << 1
    end

    inc_ip
  end

  def run_swap
    return ::Cycle::STATUS_DIED_STACK_UNDERFLOW if stack.size < 2
    tmp = stack[-1]
    stack[-1] = stack[-2]
    stack[-2] = tmp
    inc_ip
  end
end
