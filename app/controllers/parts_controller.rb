# Presenting one part instead of the whole deck — the part-level twin of
# ChaptersController: same deck view, navigation clamped to the part's slide
# range, slide positions still deck-global.
class PartsController < ApplicationController
  def show
    @presentation = Presentation.find(params[:presentation_slug])

    if @presentation.nil?
      render plain: "Presentation not found", status: :not_found
      return
    end

    @part = @presentation.find_part(params[:part_slug])

    if @part.nil?
      render plain: "Part not found", status: :not_found
      return
    end

    @start_index = @part.slides.first.index
    render "slides/show", layout: "deck"
  end
end
