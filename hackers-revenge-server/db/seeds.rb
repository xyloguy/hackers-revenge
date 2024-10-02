# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).

::Rails.logger = ::ActiveSupport::Logger.new($stdout)

::Rails.logger.info "Seeding tournament info"
::TournamentInfo.instance

::Rails.logger.info "Seeding DB with sample programs"

::Player.where("name LIKE 'Built-In: %'").destroy_all
::Player.where("name LIKE 'MX %'").destroy_all

player_1 = ::Player.create(:place => 3, :wins => 0, :losses => 6, :token => ::Player.random_token, :name => "MX R3ckl3ss")
player_2 = ::Player.create(:place => 2, :wins => 2, :losses => 4, :token => ::Player.random_token, :name => "MX Sc4r3dy C4t")
player_3 = ::Player.create(:place => 1, :wins => 6, :losses => 0, :token => ::Player.random_token, :name => "MX Sl0w F1r3")
player_4 = ::Player.create(:place => 2, :wins => 4, :losses => 2, :token => ::Player.random_token, :name => "MX Sc4nn3r")

code_1 = [{ :opcode => "HCF", :arg => nil }]
code_2 = [
  { :opcode => "NOOP", :arg => nil },
  { :opcode => "JUMP", :arg => -1 }
]
code_3 = [
  { :opcode => "PUSH", :arg => 2 },
  { :opcode => "INC", :arg => 1 },
  { :opcode => "DUPE", :arg => nil },
  { :opcode => "COPY", :arg => 2 },
  { :opcode => "JUMP", :arg => -3 },
  { :opcode => "HCF", :arg => nil }
]
code_4 = [
  { :opcode => "PUSH", :arg => 10 },
  { :opcode => "DUPE", :arg => nil },
  { :opcode => "SCAN", :arg => 1 },
  { :opcode => "JUMPG", :arg => 3 },
  { :opcode => "INC", :arg => 1 },
  { :opcode => "JUMP", :arg => -4 },
  { :opcode => "INC", :arg => -6 },
  { :opcode => "DUPE", :arg => nil },
  { :opcode => "COPY", :arg => 3 },
  { :opcode => "INC", :arg => 7 },
  { :opcode => "JUMP", :arg => -9 },
  { :opcode => "HCF", :arg => nil }
]

::Program.build(player_1, code_1).save!
::Program.build(player_2, code_2).save!
::Program.build(player_3, code_3).save!
::Program.build(player_4, code_4).save!
