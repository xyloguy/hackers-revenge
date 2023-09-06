class IndexProgramsCreatedAt < ActiveRecord::Migration[5.2]
  def change
    add_index :programs, :created_at
  end
end
