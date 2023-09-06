class FixRoundIndexes < ActiveRecord::Migration[5.2]
  def change
    remove_index :rounds, :battle_id
    remove_index :rounds, :round_number

    add_index :rounds, [:battle_id, :round_number], :unique => true
  end
end
