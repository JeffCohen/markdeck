# Presenting one chapter instead of the whole deck: same deck view, but
# navigation is clamped to the chapter's slide range so you can't arrow out of
# it mid-talk. Slide positions stay deck-global, which keeps `#N` links and the
# E-to-edit shortcut working exactly as they do unscoped.
class ChaptersController < ApplicationController
  def show
    @presentation = Presentation.find(params[:presentation_slug])

    if @presentation.nil?
      render plain: "Presentation not found", status: :not_found
      return
    end

    @chapter = @presentation.find_chapter(params[:chapter_slug])

    if @chapter.nil?
      render plain: "Chapter not found", status: :not_found
      return
    end

    @start_index = @chapter.slides.first.index
    render "slides/show", layout: "deck"
  end
end
