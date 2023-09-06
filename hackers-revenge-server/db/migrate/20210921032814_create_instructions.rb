class CreateInstructions < ActiveRecord::Migration[5.2]
  def change
    create_table :instructions do |t|
      t.bigint :program_id
      t.integer :line_number
      t.string :opcode
      t.integer :argument

      t.timestamps
    end
    add_index :instructions, :program_id
    add_index :instructions, :line_number
  end
end
