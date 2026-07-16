module Presentations
  class SettingsController < ApplicationController
    def update
      presentation = Presentation.find(params[:presentation_slug])
      return head :not_found unless presentation

      settings = params.require(:settings).permit(:theme, :mode, fonts: %i[heading body mono],
                                                    colors: %i[bg fg accent muted])

      presentation.update_config!(
        theme: settings[:theme],
        mode: settings[:mode],
        fonts: settings[:fonts].to_h.to_hash,
        colors: settings[:colors].to_h.to_hash
      )

      render json: { theme: presentation.theme, mode: presentation.mode }
    rescue ArgumentError => e
      render json: { error: e.message }, status: :unprocessable_entity
    end
  end
end
