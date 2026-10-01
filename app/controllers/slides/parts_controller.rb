module Slides
  # Sets or clears the `part:` marker on one slide — the part-level twin of
  # Slides::ChaptersController, going through the same Slide.with_front_matter
  # transform.
  class PartsController < ApplicationController
    before_action :load_slide

    def update
      name = params.require(:part).permit(:name)[:name].to_s.strip

      if name.empty?
        render json: { error: "part name can't be blank" }, status: :unprocessable_entity
        return
      end

      write_part(name)
    end

    # Removes the marker only — the slide stays where it is and folds into
    # whichever part now precedes it.
    def destroy
      write_part(nil)
    end

    private

    def load_slide
      @presentation = Presentation.find(params[:presentation_slug])
      return head :not_found unless @presentation

      @slide = @presentation.slides[params[:slide_n].to_i - 1]
      head :not_found unless @slide
    end

    def write_part(name)
      @slide.write!(Slide.with_front_matter(@slide.markdown, key: "part", value: name))
      head :no_content
    end
  end
end
