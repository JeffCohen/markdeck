class PresentationsController < ApplicationController
  def index
    @presentations = Presentation.all
  end

  def show
    @presentation = Presentation.find(params[:slug])

    if @presentation.nil?
      render plain: "Presentation not found", status: :not_found
      return
    end

    render layout: "deck"
  end
end
