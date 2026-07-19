class SlidesController < ApplicationController
  before_action :load_presentation
  before_action :load_slide, only: %i[show edit update destroy]

  def show
    @start_index = @slide.index
    render layout: "deck"
  end

  def edit
    render layout: "themed"
  end

  def update
    body = params.require(:slide).permit(:body, :etag)
    if body[:etag].present? && body[:etag] != @slide.etag
      render json: { error: "stale", current_etag: @slide.etag }, status: :conflict
      return
    end

    @slide.write!(body[:body].to_s)
    fresh = Slide.new(index: @slide.index, source_path: @slide.source_path, slug: @presentation.slug)
    render json: { etag: fresh.etag, saved_at: Time.current.iso8601 }
  end

  def create
    after = params[:after].presence&.to_i
    body  = params[:body].presence
    new_slide = @presentation.create_slide!(after_position: after, body: body)
    redirect_to edit_presentation_slide_path(@presentation, n: new_slide.position), status: :see_other
  end

  def destroy
    @slide.source_path.delete
    head :no_content
  end

  private

  def load_presentation
    @presentation = Presentation.find(params[:presentation_slug])
    head :not_found unless @presentation
  end

  def load_slide
    return unless @presentation
    n = params[:n].to_i
    @slide = @presentation.slides[n - 1]
    head :not_found unless @slide
  end
end
