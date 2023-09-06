class Cycle
  STATUS_TIE = -1
  STATUS_RUNNING = 0
  STATUS_DIED_EXECUTING_NIL = 1
  STATUS_DIED_EXECUTING_ENEMY_HCF = 2
  STATUS_DIED_EXECUTING_OWN_HCF = 3
  STATUS_DIED_STACK_OVERFLOW = 4
  STATUS_DIED_STACK_UNDERFLOW = 5
  STATUS_DIED_ARG_OVERFLOW = 6
  STATUS_DIED_INVALID_OPCODE = 7
  STATUS_DIED_JUMP_0 = 8

  attr_accessor :cycle_number
  attr_accessor :program_number
  attr_accessor :status
  attr_accessor :opcode
  attr_accessor :argument
  attr_accessor :old_ip
  attr_accessor :new_ip
  attr_accessor :old_stack
  attr_accessor :new_stack
  attr_accessor :read_addr_first
  attr_accessor :read_addr_last
  attr_accessor :writes # array of hashes containing :addr, :opcode, and :argument

  def initialize(**kwargs)
    @cycle_number = kwargs[:cycle_number]
    @program_number = kwargs[:program_number]
    @status = kwargs[:status]
    @opcode = kwargs[:opcode]
    @argument = kwargs[:argument]
    @old_ip = kwargs[:old_ip]
    @new_ip = kwargs[:new_ip]
    @old_stack = kwargs[:old_stack]
    @new_stack = kwargs[:new_stack]
    @read_addr_first = kwargs[:read_addr_first]
    @read_addr_last = kwargs[:read_addr_last]
    @writes = kwargs[:writes]
  end

  def to_hash_for_journal
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
      :read_addr_last => read_addr_last
    }.merge(writes_hash)
  end

private

  def write_hash(write)
    return nil if write[:addr].nil?

    h = { :addr => write[:addr] }
    h[:opcode] = write[:opcode] if write[:opcode].present?
    h[:arg] = write[:argument] if write[:opcode].present? || write[:argument].present?

    h
  end

  def writes_array
    writes.filter_map { |write| write_hash(write) }
  end

  def writes_hash
    return {} if writes.nil?

    {
      :writes => writes_array
    }
  end
end
