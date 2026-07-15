require "yaml"
require "securerandom"
require "digest"

class Slide
  FRONT_MATTER_PATTERN = /\A---\s*\n(.*?)\n---\s*\n?/m
  NOTES_PATTERN        = /<!--\s*notes\s*(.*?)-->/m
  CENTER_PATTERN       = /<!--\s*center\s*-->/

  PERMITTED_FRONT_MATTER_KEYS = %w[center label chapter].freeze

  attr_reader :index, :source_path, :slug

  def initialize(index:, source_path:, slug: nil)
    @index = index
    @source_path = source_path
    @slug = slug
  end

  def markdown
    @markdown ||= source_path.read
  end

  def html
    @html ||= MarkdownRenderer.render(visible_markdown, image_base: image_base)
  end

  def notes_html
    @notes_html ||= raw_notes.present? ? MarkdownRenderer.render(raw_notes) : nil
  end

  def notes?
    raw_notes.present?
  end

  def centered?
    return front_matter["center"] == true if front_matter.key?("center")
    markdown.match?(CENTER_PATTERN)
  end

  def label
    front_matter["label"].presence
  end

  def chapter
    front_matter["chapter"].presence
  end

  def title
    @title ||= extract_title
  end

  def number
    index + 1
  end

  alias_method :position, :number

  def basename
    source_path.basename.to_s
  end

  # "07-pricing-chart.md" -> "pricing-chart"
  def filename_stem
    basename.sub(/\A\d+[-_]?/, "").sub(/\.md\z/, "")
  end

  def heading
    visible_markdown.match(/^\s*#\s+(.+)$/)&.[](1)&.strip
  end

  # Alt text of the first image in the visible body, if any.
  def first_image_alt
    visible_markdown.match(/!\[([^\]]+)\]\([^)]+\)/)&.[](1)&.strip
  end

  # sha256 of the on-disk markdown when this Slide was loaded.
  # Used for the editor's staleness check on save.
  def etag
    Digest::SHA256.hexdigest(markdown)
  end

  # Atomically replace the file contents with `new_body`. tmp + rename keeps
  # readers from ever seeing a partial write.
  def write!(new_body)
    tmp = source_path.dirname.join("#{basename}.tmp.#{Process.pid}.#{SecureRandom.hex(4)}")
    tmp.binwrite(new_body)
    tmp.rename(source_path)
  end

  # Pure string transform used by the editor's attribute toggles.
  # Rewrites the front-matter block at the top of `body` with `key=value`
  # (deleting the key when value is nil/false/""). When setting `center`,
  # also strips any legacy `<!-- center -->` so we never have two sources
  # of truth.
  def self.with_front_matter(body, key:, value:)
    raise ArgumentError unless PERMITTED_FRONT_MATTER_KEYS.include?(key.to_s)
    key = key.to_s
    fm = parse_front_matter(body) || {}

    if value.nil? || value == false || value == ""
      fm.delete(key)
    else
      fm[key] = value
    end

    rest = body.sub(FRONT_MATTER_PATTERN, "")
    rest = rest.gsub(CENTER_PATTERN, "") if key == "center"

    if fm.empty?
      rest
    else
      "#{emit_front_matter(fm)}#{rest}"
    end
  end

  def self.emit_front_matter(hash)
    # Hash#to_yaml emits its own "---\n" header; we re-format to keep the
    # block compact and predictable across Psych versions.
    body = hash.map { |k, v| "#{k}: #{v.to_yaml.sub(/\A---\s*\n?/, '').strip}" }.join("\n")
    "---\n#{body}\n---\n"
  end

  def self.visible_markdown_for(body)
    body.sub(FRONT_MATTER_PATTERN, "")
        .gsub(NOTES_PATTERN, "")
        .gsub(CENTER_PATTERN, "")
  end

  def self.centered_from_body?(body)
    fm = parse_front_matter(body)
    return fm["center"] == true if fm&.key?("center")
    body.match?(CENTER_PATTERN)
  end

  def self.parse_front_matter(body)
    m = body.match(FRONT_MATTER_PATTERN) or return nil
    parsed = begin
      YAML.safe_load(m[1])
    rescue Psych::SyntaxError
      nil
    end
    parsed.is_a?(Hash) ? parsed.slice(*PERMITTED_FRONT_MATTER_KEYS) : nil
  end

  private

  def image_base
    slug ? "/presentations/#{slug}/images" : nil
  end

  def visible_markdown
    @visible_markdown ||= self.class.visible_markdown_for(markdown)
  end

  def raw_notes
    @raw_notes ||= (m = markdown.match(NOTES_PATTERN)) ? m[1].strip : ""
  end

  def front_matter
    @front_matter ||= self.class.parse_front_matter(markdown) || {}
  end

  def extract_title
    heading || label || "Slide #{number}"
  end
end
