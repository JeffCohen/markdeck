Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  resources :presentations, only: %i[index show], param: :slug do
    get "images/:filename", to: "presentations#image", as: :image,
        constraints: { filename: /[^\/]+/ }, format: false, on: :member

    resources :slides, only: %i[show edit update create destroy],
              param: :n, constraints: { n: /\d+/ } do
      # A slide's chapter marker is its own resource rather than a custom action
      # on slides: PATCH opens a chapter here, DELETE removes the marker while
      # leaving the slide alone.
      resource :chapter, only: %i[update destroy], module: :slides
    end

    # Presenting a single chapter — a scoped view of the deck.
    resources :chapters, only: :show, param: :chapter_slug

    resource  :slide_order, only: :update
    resource  :settings, only: :update, module: :presentations
    resources :previews, only: :create, module: :presentations
  end

  root "presentations#index"
end
