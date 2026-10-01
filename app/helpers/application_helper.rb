module ApplicationHelper
  # JSON payload consumed by palette_controller. `target` selects the URL
  # Enter navigates to: :present or :edit.
  # Walks parts and chapters rather than slides so each entry carries its
  # EFFECTIVE part and chapter (inherited from the markers above it), which the
  # palette uses both as group headings and as searchable text.
  def slides_palette_json(presentation, target:)
    presentation.parts.flat_map do |part|
      part.chapters.flat_map { |chapter| chapter.slides.map { |s| [part, chapter, s] } }
    end.map do |part, chapter, s|
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
        part:      part.name,
        chapter:   chapter.name,
        url:       url
      }
    end
  end
end
