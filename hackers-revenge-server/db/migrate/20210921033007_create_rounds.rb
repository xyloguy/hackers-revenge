class CreateRounds < ActiveRecord::Migration[5.2]
  def change
    create_table :rounds do |t|
      t.bigint :battle_id
      t.integer :round_number
      t.integer :winner
      t.integer :player1_start_ip
      t.integer :player2_start_ip

      t.timestamps
    end
    add_index :rounds, :battle_id
    add_index :rounds, :round_number
  end
end
