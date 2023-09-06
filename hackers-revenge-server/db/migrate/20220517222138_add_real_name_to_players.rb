class AddRealNameToPlayers < ActiveRecord::Migration[5.2]
  def change
    add_column :players, :real_name, :string
  end
end
