class AddLastProgramIdToPlayers < ActiveRecord::Migration[5.2]
  def change
    add_column :players, :last_program_id, :bigint
    add_index :players, :last_program_id
  end
end
