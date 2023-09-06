class DropCycles < ActiveRecord::Migration[5.2]
  def change
    drop_table :cycles do |t|
      t.bigint :round_id
      t.integer :cycle_number
      t.integer :program_number
      t.integer :status
      t.string :opcode
      t.integer :argument
      t.integer :new_ip
      t.text :new_stack
      t.integer :read_addr_first
      t.integer :read_addr_last
      t.integer :write_addr
      t.string :write_opcode
      t.integer :write_argument

      t.timestamps
      t.index [:round_id, :cycle_number, :program_number], :unique => true
    end
  end
end
