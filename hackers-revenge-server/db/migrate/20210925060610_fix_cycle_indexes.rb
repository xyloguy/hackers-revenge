class FixCycleIndexes < ActiveRecord::Migration[5.2]
  def change
    remove_index :cycles, :round_id
    remove_index :cycles, :cycle_number

    add_index :cycles, [:round_id, :cycle_number, :program_number], :unique => true
  end
end
