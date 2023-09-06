class RenamePlayerToProgram < ActiveRecord::Migration[5.2]
  def change
    rename_column :battles, :player1_id, :program1_id
    rename_column :battles, :player2_id, :program2_id

    rename_column :rounds, :player1_start_ip, :program1_start_ip
    rename_column :rounds, :player2_start_ip, :program2_start_ip

    rename_column :cycles, :player_num, :program_num
  end
end
