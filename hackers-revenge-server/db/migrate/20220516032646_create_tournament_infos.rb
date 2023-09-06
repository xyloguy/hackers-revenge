class CreateTournamentInfos < ActiveRecord::Migration[5.2]
  def change
    create_table :tournament_infos do |t|
      t.datetime :end_at

      t.timestamps
    end
  end
end
