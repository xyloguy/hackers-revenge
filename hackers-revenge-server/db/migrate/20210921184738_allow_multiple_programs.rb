class AllowMultiplePrograms < ActiveRecord::Migration[5.2]
  def change
    remove_index :programs, :player_id # , :unique => true
    add_index :programs, :player_id
  end
end
