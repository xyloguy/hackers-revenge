# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2022_05_16_040156) do
  create_table "battles", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "program1_id"
    t.bigint "program2_id"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.integer "winner"
    t.index ["program1_id"], name: "index_battles_on_program1_id"
    t.index ["program2_id"], name: "index_battles_on_program2_id"
  end

  create_table "instructions", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "program_id"
    t.integer "line_number"
    t.string "opcode"
    t.integer "argument"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["program_id", "line_number"], name: "index_instructions_on_program_id_and_line_number", unique: true
  end

  create_table "players", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "token"
    t.string "name"
    t.integer "wins"
    t.integer "losses"
    t.integer "ties"
    t.integer "score"
    t.bigint "last_battle_id"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.bigint "last_program_id"
    t.integer "place"
    t.index ["last_battle_id"], name: "index_players_on_last_battle_id"
    t.index ["last_program_id"], name: "index_players_on_last_program_id"
    t.index ["name"], name: "index_players_on_name", unique: true
    t.index ["place"], name: "index_players_on_place"
    t.index ["score"], name: "index_players_on_score"
    t.index ["token"], name: "index_players_on_token", unique: true
  end

  create_table "programs", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "player_id"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["created_at"], name: "index_programs_on_created_at"
    t.index ["player_id"], name: "index_programs_on_player_id"
  end

  create_table "rounds", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "battle_id"
    t.integer "round_number"
    t.integer "winner"
    t.integer "program1_start_ip"
    t.integer "program2_start_ip"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.integer "first_player"
    t.index ["battle_id", "round_number"], name: "index_rounds_on_battle_id_and_round_number", unique: true
  end

  create_table "tournament_infos", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.datetime "end_at", precision: nil
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.integer "matches"
  end
end
