FactoryBot.define do
  factory :round do
    association :battle
    round_number { 1 }
    winner { nil }
    program1_start_ip { 0 }
    program2_start_ip { 128 }
    first_player { 1 }
  end
end
