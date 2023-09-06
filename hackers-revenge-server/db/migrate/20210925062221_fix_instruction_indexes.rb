class FixInstructionIndexes < ActiveRecord::Migration[5.2]
  def change
    remove_index :instructions, :program_id
    remove_index :instructions, :line_number

    add_index :instructions, [:program_id, :line_number], :unique => true
  end
end
