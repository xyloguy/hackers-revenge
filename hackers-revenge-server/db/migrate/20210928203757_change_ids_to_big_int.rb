class ChangeIdsToBigInt < ActiveRecord::Migration[5.2]
  def up
    change_column :battles, :program1_id, :bigint
    change_column :rounds, :battle_id, :bigint
  end

  def down
    change_column :battles, :program1_id, :integer
    change_column :rounds, :battle_id, :integer
  end
end
