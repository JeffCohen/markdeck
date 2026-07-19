require "securerandom"

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
    "muted" => "#737373",
    "highlight" => "#60a5fa"
  }.freeze

  DEFAULT_COLORS_LIGHT = {
    "bg" => "#fafafa",
    "fg" => "#171717",
    "accent" => "#2563eb",
    "muted" => "#737373",
    "highlight" => "#2563eb"
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
      "--md-highlight" => colors["highlight"],
      "--md-font-heading" => %("#{fonts['heading']}", #{SANS_FALLBACK}),
      "--md-font-body" => %("#{fonts['body']}", #{SANS_FALLBACK}),
      "--md-font-mono" => %("#{fonts['mono']}", #{MONO_FALLBACK})
    }
  end

  def slides_dir
    @dir.join("slides")
  end

  def images_dir
    @dir.join("images")
  end

  # Next zero-padded NN- prefix at the END of the deck, e.g. "07". New slides
  # always append; insertion in the middle is handled by create_slide!'s reorder.
  def next_slide_prefix
    taken = slides.map { |s| s.basename[/\A(\d+)/, 1].to_i }
    width = [2, taken.map { |n| n.to_s.length }.max || 2].max
    n = (taken.max || 0) + 1
    format("%0#{width}d", n)
  end

  # Create a new slide file after `after_position` (1-based; nil = end of deck).
  # Returns the new Slide object.
  def create_slide!(after_position: nil, body: nil)
    prefix = next_slide_prefix
    path = slides_dir.join("#{prefix}-slide.md")
    path.binwrite(body || "# New slide\n")

    # If inserting in the middle, run a reorder so the new slide actually
    # lands at the requested visual position. The reorder renames the file
    # (it's no longer at `path`), so grab the result by the position we
    # placed it at rather than re-matching on `prefix`.
    if after_position
      reload_slides!
      target_pos = [[after_position, 0].max, slides.size - 1].min + 1
      current_pos_of_new = slides.index { |s| s.source_path == path } + 1
      order = (1..slides.size).to_a
      order.delete(current_pos_of_new)
      order.insert(target_pos - 1, current_pos_of_new)
      reorder!(order)
      return slides[target_pos - 1]
    end

    reload_slides!
    slides.find { |s| s.source_path.basename.to_s.start_with?(prefix + "-") } || slides.last
  end

  # Reorder slides on disk. `new_order_positions` is the current 1-based
  # positions in their new order, e.g. [3, 1, 2, 4] meaning "what is currently
  # slide 3 becomes slide 1; slide 1 → 2; slide 2 → 3; slide 4 stays".
  # Two-phase rename (everything → unique tmp names → final names) avoids
  # collisions. Coarse flock guards against concurrent saves.
  def reorder!(new_order_positions)
    unless new_order_positions.sort == (1..slides.size).to_a
      raise ArgumentError, "expected a permutation of 1..#{slides.size}, got #{new_order_positions.inspect}"
    end

    width = [2, slides.map { |s| s.basename[/\A(\d+)/, 1].to_s.length }.max || 2].max

    slides_dir.join(".reorder.lock").open(File::RDWR | File::CREAT, 0o644) do |lock|
      lock.flock(File::LOCK_EX)

      tmp_paths = slides.map do |s|
        s.source_path.dirname.join("#{s.basename}.reorder.#{SecureRandom.hex(4)}")
      end
      slides.each_with_index { |s, i| s.source_path.rename(tmp_paths[i]) }

      new_order_positions.each_with_index do |old_pos, new_idx|
        stem = slides[old_pos - 1].filename_stem
        target = slides_dir.join("#{format("%0#{width}d", new_idx + 1)}-#{stem}.md")
        tmp_paths[old_pos - 1].rename(target)
      end
    end

    reload_slides!
  end

  def reload_slides!
    @slides = load_slides
  end

  def config_path
    @dir.join("config.yml")
  end

  # Persist deck-level settings back to config.yml, preserving any other
  # keys already there (e.g. title). Mirrors Slide#write!'s tmp+rename.
  def update_config!(theme:, mode:, fonts:, colors:)
    raise ArgumentError, "invalid theme" unless THEMES.include?(theme)
    raise ArgumentError, "invalid mode" unless MODES.include?(mode)

    raw = config_path.exist? ? (YAML.safe_load(config_path.read) || {}) : {}
    raw["theme"] = theme
    raw["mode"] = mode
    raw["fonts"] = fonts
    raw["colors"] = colors

    tmp = config_path.dirname.join("#{config_path.basename}.tmp.#{Process.pid}.#{SecureRandom.hex(4)}")
    tmp.write(YAML.dump(raw))
    tmp.rename(config_path)

    @theme = theme
    @mode = mode
    @fonts = DEFAULT_FONTS.merge(fonts)
    @colors = default_colors_for_mode.merge(colors)
  end

  private

  def default_colors_for_mode
    @mode == "light" ? DEFAULT_COLORS_LIGHT : DEFAULT_COLORS_DARK
  end

  def load_slides
    return [] unless slides_dir.directory?

    slides_dir.glob("*.md").sort_by { |p| p.basename.to_s }.each_with_index.map do |path, idx|
      Slide.new(index: idx, source_path: path, slug: @slug)
    end
  end
end
