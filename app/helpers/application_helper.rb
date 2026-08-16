module ApplicationHelper
  # JSON payload consumed by palette_controller. `target` selects the URL
  # Enter navigates to: :present or :edit.
  # Walks chapters rather than slides so each entry carries its EFFECTIVE
  # chapter (inherited from the marker above it), which the palette uses both as
  # a group heading and as searchable text.
  def slides_palette_json(presentation, target:)
    presentation.chapters.flat_map do |chapter|
      chapter.slides.map do |s|
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
          chapter:   chapter.name,
          url:       url
        }
      end
    end
  end
end
