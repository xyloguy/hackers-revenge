class RemoveCatchUpsFromPlayer < ActiveRecord::Migration[5.2]
  def change
    remove_column :players, :catch_ups, :integer
  end
end
