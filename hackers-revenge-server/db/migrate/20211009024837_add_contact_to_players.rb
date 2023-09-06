class AddContactToPlayers < ActiveRecord::Migration[5.2]
  def change
    add_column :players, :contact, :boolean
  end
end
