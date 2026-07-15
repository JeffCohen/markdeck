class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  # Changes to the importmap will invalidate the etag for HTML responses
  stale_when_importmap_changes

  before_action :authenticate

  private

  # Single-user HTTP Basic Auth, production only.
  def authenticate
    return unless Rails.env.production?

    expected_user = Rails.application.credentials.dig(:auth, :user)
    expected_password = Rails.application.credentials.dig(:auth, :password)
    return if expected_user.blank? || expected_password.blank?

    authenticate_or_request_with_http_basic("Markdeck") do |user, password|
      ActiveSupport::SecurityUtils.secure_compare(user, expected_user) &
        ActiveSupport::SecurityUtils.secure_compare(password, expected_password)
    end
  end
end
