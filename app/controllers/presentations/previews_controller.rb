module Presentations
  class PreviewsController < ApplicationController
    def create
      presentation = Presentation.find(params[:presentation_slug])
      return head :not_found unless presentation

      body = params.require(:preview).permit(:body)[:body].to_s
      visible = Slide.visible_markdown_for(body)
      html = MarkdownRenderer.render(visible, image_base: "/presentations/#{presentation.slug}/images")

      render json: {
        html: html,
        centered: Slide.centered_from_body?(body)
      }
    end
  end
end
