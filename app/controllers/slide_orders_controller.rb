class SlideOrdersController < ApplicationController
  def update
    presentation = Presentation.find(params[:presentation_slug])
    return head :not_found unless presentation

    order = Array(params[:order]).map(&:to_i)
    presentation.reorder!(order)
    head :no_content
  rescue ArgumentError => e
    render json: { error: e.message }, status: :unprocessable_entity
  end
end
