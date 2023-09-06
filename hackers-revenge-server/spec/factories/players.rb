FactoryBot.define do
  factory :player do
    token { ::Player.random_token }
    name { ::Faker::Base.bothify("?????? ??????") }
    email { ::Faker::Base.bothify("??????@?????.com") }
    phone { "101-222-3333" }
    contact { false }
  end
end
