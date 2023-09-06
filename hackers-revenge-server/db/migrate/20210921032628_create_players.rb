class CreatePlayers < ActiveRecord::Migration[5.2]
  def change
    create_table :players do |t|
      t.string :token
      t.string :name
      t.string :email
      t.integer :wins
      t.integer :losses
      t.integer :ties
      t.integer :catch_ups
      t.integer :score
      t.bigint :last_battle_id

      t.timestamps
    end
    add_index :players, :token, :unique => true
    add_index :players, :name, :unique => true
    add_index :players, :email, :unique => true
    add_index :players, :score
    add_index :players, :last_battle_id
  end
end
