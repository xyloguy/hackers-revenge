class CreatePrograms < ActiveRecord::Migration[5.2]
  def change
    create_table :programs do |t|
      t.bigint :player_id

      t.timestamps
    end
    add_index :programs, :player_id, :unique => true
  end
end
