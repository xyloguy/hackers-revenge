class RenameCycleAndProgramNum < ActiveRecord::Migration[5.2]
  def change
    rename_column :cycles, :cycle, :cycle_number
    rename_column :cycles, :program_num, :program_number
  end
end
