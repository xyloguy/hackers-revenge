class CreateBattles < ActiveRecord::Migration[5.2]
  def change
    create_table :battles do |t|
      t.bigint :player1_id
      t.bigint :player2_id

      t.timestamps
    end
    add_index :battles, :player1_id
    add_index :battles, :player2_id
  end
end
