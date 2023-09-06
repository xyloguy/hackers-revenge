FactoryBot.define do
  factory :battle do
    association :program1, :factory => :program
    association :program2, :factory => :program
  end
end
