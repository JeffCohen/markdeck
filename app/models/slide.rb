class Slide
  NOTES_PATTERN = /<!--\s*notes\s*(.*?)-->/m

  attr_reader :index, :source_path

  def initialize(index:, source_path:)
    @index = index
    @source_path = source_path
  end

  def markdown
    @markdown ||= source_path.read
  end

  def html
    @html ||= MarkdownRenderer.render(visible_markdown)
  end

  def notes_html
    @notes_html ||= raw_notes.present? ? MarkdownRenderer.render(raw_notes) : nil
  end

  def notes?
    raw_notes.present?
  end

  def title
    @title ||= extract_title
  end

  def number
    index + 1
  end

  private

  def visible_markdown
    @visible_markdown ||= markdown.gsub(NOTES_PATTERN, "")
  end

  def raw_notes
    @raw_notes ||= (m = markdown.match(NOTES_PATTERN)) ? m[1].strip : ""
  end

  def extract_title
    if (m = visible_markdown.match(/^\s*#\s+(.+)$/))
      m[1].strip
    else
      "Slide #{number}"
    end
  end
end
