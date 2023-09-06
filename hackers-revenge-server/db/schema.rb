# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2022_05_17_222138) do

  create_table "battles", force: :cascade do |t|
    t.bigint "program1_id"
    t.bigint "program2_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "winner"
    t.index ["program1_id"], name: "index_battles_on_program1_id"
    t.index ["program2_id"], name: "index_battles_on_program2_id"
  end

  create_table "instructions", force: :cascade do |t|
    t.bigint "program_id"
    t.integer "line_number"
    t.string "opcode"
    t.integer "argument"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["program_id", "line_number"], name: "index_instructions_on_program_id_and_line_number", unique: true
  end

  create_table "players", force: :cascade do |t|
    t.string "token"
    t.string "name"
    t.string "email"
    t.integer "wins"
    t.integer "losses"
    t.integer "ties"
    t.integer "score"
    t.integer "last_battle_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "last_program_id"
    t.string "phone"
    t.integer "place"
    t.boolean "contact"
    t.string "real_name"
    t.index ["email"], name: "index_players_on_email", unique: true
    t.index ["last_battle_id"], name: "index_players_on_last_battle_id"
    t.index ["last_program_id"], name: "index_players_on_last_program_id"
    t.index ["name"], name: "index_players_on_name", unique: true
    t.index ["place"], name: "index_players_on_place"
    t.index ["score"], name: "index_players_on_score"
    t.index ["token"], name: "index_players_on_token", unique: true
  end

  create_table "programs", force: :cascade do |t|
    t.bigint "player_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["created_at"], name: "index_programs_on_created_at"
    t.index ["player_id"], name: "index_programs_on_player_id"
  end

  create_table "rounds", force: :cascade do |t|
    t.bigint "battle_id"
    t.integer "round_number"
    t.integer "winner"
    t.integer "program1_start_ip"
    t.integer "program2_start_ip"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "first_player"
    t.index ["battle_id", "round_number"], name: "index_rounds_on_battle_id_and_round_number", unique: true
  end

  create_table "tournament_infos", force: :cascade do |t|
    t.datetime "end_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "matches"
  end

end
