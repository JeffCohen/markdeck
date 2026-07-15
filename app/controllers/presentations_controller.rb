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

    render layout: "themed"
  end

  def image
    filename = params[:filename]
    return head :bad_request if filename.include?("..") || filename.start_with?("/")

    path = Presentation::ROOT.join(params[:slug], "images", filename)
    return head :not_found unless path.file?

    send_file path.to_s, disposition: "inline"
  end
end
