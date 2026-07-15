module ApplicationHelper
  # JSON payload consumed by palette_controller. `target` selects the URL
  # Enter navigates to: :present or :edit.
  def slides_palette_json(presentation, target:)
    presentation.slides.map do |s|
      url = case target
            when :edit    then edit_presentation_slide_path(presentation, n: s.position)
            when :present then presentation_slide_path(presentation, n: s.position)
            else raise ArgumentError, "unknown palette target: #{target.inspect}"
            end
      {
        n:         s.position,
        title:     s.title,
        label:     s.label,
        heading:   s.heading,
        image_alt: s.first_image_alt,
        url:       url
      }
    end
  end
end
