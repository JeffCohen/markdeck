class Presentation
  ROOT = Rails.root.join("presentations").freeze

  THEMES = %w[minimal editorial terminal aurora].freeze
  MODES = %w[dark light].freeze

  DEFAULT_FONTS = {
    "heading" => "Inter",
    "body" => "Inter",
    "mono" => "JetBrains Mono"
  }.freeze

  DEFAULT_COLORS_DARK = {
    "bg" => "#0a0a0a",
    "fg" => "#e5e5e5",
    "accent" => "#60a5fa",
    "muted" => "#737373"
  }.freeze

  DEFAULT_COLORS_LIGHT = {
    "bg" => "#fafafa",
    "fg" => "#171717",
    "accent" => "#2563eb",
    "muted" => "#737373"
  }.freeze

  attr_reader :slug, :title, :theme, :mode, :fonts, :colors, :slides

  def self.all
    return [] unless ROOT.exist?

    ROOT.children.select(&:directory?).sort_by(&:basename).map do |dir|
      load(dir.basename.to_s)
    end.compact
  end

  def self.find(slug)
    dir = ROOT.join(slug)
    return nil unless dir.directory?

    load(slug)
  end

  def self.load(slug)
    dir = ROOT.join(slug)
    config_path = dir.join("config.yml")
    config = config_path.exist? ? (YAML.safe_load(config_path.read) || {}) : {}

    new(slug: slug, dir: dir, config: config)
  end

  def initialize(slug:, dir:, config:)
    @slug = slug
    @dir = dir
    @title = config["title"].presence || slug.titleize
    @theme = THEMES.include?(config["theme"]) ? config["theme"] : "minimal"
    @mode = MODES.include?(config["mode"]) ? config["mode"] : "dark"
    @fonts = DEFAULT_FONTS.merge(config["fonts"] || {})
    @colors = default_colors_for_mode.merge(config["colors"] || {})
    @slides = load_slides
  end

  def to_param
    slug
  end

  def google_fonts_url
    families = fonts.values.uniq.map do |name|
      "family=#{ERB::Util.url_encode(name)}:wght@400;500;600;700"
    end
    "https://fonts.googleapis.com/css2?#{families.join('&')}&display=swap"
  end

  SANS_FALLBACK = %(system-ui, -apple-system, "Segoe UI", sans-serif).freeze
  MONO_FALLBACK = %(ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace).freeze

  def css_variables
    {
      "--md-bg" => colors["bg"],
      "--md-fg" => colors["fg"],
      "--md-accent" => colors["accent"],
      "--md-muted" => colors["muted"],
      "--md-font-heading" => %("#{fonts['heading']}", #{SANS_FALLBACK}),
      "--md-font-body" => %("#{fonts['body']}", #{SANS_FALLBACK}),
      "--md-font-mono" => %("#{fonts['mono']}", #{MONO_FALLBACK})
    }
  end

  private

  def default_colors_for_mode
    @mode == "light" ? DEFAULT_COLORS_LIGHT : DEFAULT_COLORS_DARK
  end

  def load_slides
    slides_dir = @dir.join("slides")
    return [] unless slides_dir.directory?

    slides_dir.glob("*.md").sort_by { |p| p.basename.to_s }.each_with_index.map do |path, idx|
      Slide.new(index: idx, source_path: path)
    end
  end
end
