class SplitCycleReadAddr < ActiveRecord::Migration[5.2]
  def change
    rename_column :cycles, :read_addr, :read_addr_first
    add_column :cycles, :read_addr_last, :integer
  end
end
