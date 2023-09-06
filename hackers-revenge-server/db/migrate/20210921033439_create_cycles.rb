class CreateCycles < ActiveRecord::Migration[5.2]
  def change
    create_table :cycles do |t|
      t.bigint :round_id
      t.integer :cycle
      t.integer :player_num
      t.integer :status
      t.string :opcode
      t.integer :argument
      t.integer :new_ip
      t.text :new_stack
      t.integer :read_addr
      t.integer :write_addr
      t.string :write_opcode
      t.integer :write_argument

      t.timestamps
    end
    add_index :cycles, :round_id
    add_index :cycles, :cycle
  end
end
