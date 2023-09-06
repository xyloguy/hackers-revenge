FactoryBot.define do
  factory :instruction do
    association :program
    line_number { 1 }
    opcode { "PUSH" }
    argument { 42 }
  end
end
