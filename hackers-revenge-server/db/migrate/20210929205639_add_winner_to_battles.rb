class AddWinnerToBattles < ActiveRecord::Migration[5.2]
  def change
    add_column :battles, :winner, :integer
  end
end
