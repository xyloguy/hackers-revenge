class AddFirstPlayerToRounds < ActiveRecord::Migration[5.2]
  def change
    add_column :rounds, :first_player, :integer
  end
end
