class AddPlaceToPlayers < ActiveRecord::Migration[5.2]
  def change
    add_column :players, :place, :integer
  end
end
