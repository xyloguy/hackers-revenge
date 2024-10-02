Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  defaults :format => :json do
    # error routes
    match "/400", :to => "errors#bad_request", :via => :all
    match "/404", :to => "errors#not_found", :via => :all
    match "/500", :to => "errors#unknown_error", :via => :all
    match "/501", :to => "errors#not_implemented", :via => :all

    root "errors#teapot"

    get "/healthy", :to => "application#success"
    get "/status", :to => "status#show"
    get "/token", :to => "token#show"
    get "/leaderboard", :to => "leaderboard#show"
    get "/contenders", :to => "contenders#show"
    get "/journal/:battle_id/:round_num", :to => "round#show"

    post "/program", :to => "program#create"
    #post "/test_round", :to => "test_round#create"
    post "/test_round", :to => "test_round_p2existing#create"
    post "/test_round_p2existing", :to => "test_round_p2existing#create"
  end
end
