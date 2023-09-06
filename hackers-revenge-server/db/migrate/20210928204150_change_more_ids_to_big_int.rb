class ChangeMoreIdsToBigInt < ActiveRecord::Migration[5.2]
  def up
    change_column :battles, :program2_id, :bigint
  end

  def down
    change_column :battles, :program2_id, :integer
  end
end
