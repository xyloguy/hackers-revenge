FactoryBot.define do
  factory :player do
    token { ::Player.random_token }
    name { ::Faker::Base.bothify("?????? ??????") }
  end
end
