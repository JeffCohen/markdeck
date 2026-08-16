module Slides
  # Sets or clears the `chapter:` marker on one slide. The front-matter rewrite
  # itself is Slide.with_front_matter, the same pure transform the editor's
  # attribute toggles use, so there's one implementation of the syntax.
  class ChaptersController < ApplicationController
    before_action :load_slide

    def update
      name = params.require(:chapter).permit(:name)[:name].to_s.strip

      if name.empty?
        render json: { error: "chapter name can't be blank" }, status: :unprocessable_entity
        return
      end

      write_chapter(name)
    end

    # Removes the marker only — the slide stays where it is and folds into
    # whichever chapter now precedes it.
    def destroy
      write_chapter(nil)
    end

    private

    def load_slide
      @presentation = Presentation.find(params[:presentation_slug])
      return head :not_found unless @presentation

      @slide = @presentation.slides[params[:slide_n].to_i - 1]
      head :not_found unless @slide
    end

    def write_chapter(name)
      @slide.write!(Slide.with_front_matter(@slide.markdown, key: "chapter", value: name))
      head :no_content
    end
  end
end
