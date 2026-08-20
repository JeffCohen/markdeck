require "securerandom"

class Presentation
  ROOT = Rails.root.join("presentations").freeze

  # Placeholder body for a slide created with no content of its own. The editor
  # receives the heading text and pre-selects it, so the constant is the single
  # source of truth for what counts as "not yet written".
  NEW_SLIDE_HEADING = "New slide"
  NEW_SLIDE_BODY = "# #{NEW_SLIDE_HEADING}\n".freeze

  THEMES = %w[minimal editorial terminal aurora].freeze
  MODES = %w[dark light].freeze
  BODY_SIZES = %w[small medium large].freeze
  BODY_SIZE_SCALES = { "small" => "0.85", "medium" => "1", "large" => "1.15" }.freeze

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

  attr_reader :slug, :title, :theme, :mode, :body_size, :fonts, :colors, :slides

  # A run of consecutive slides sharing a `chapter:` marker. `name` is nil for
  # the leading run of slides that appear before the deck's first marker.
  Chapter = Struct.new(:name, :slug, :slides, keyword_init: true) do
    def named?
      !name.nil?
    end

    def first_position
      slides.first.position
    end

    def last_position
      slides.last.position
    end

    def size
      slides.size
    end
  end

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

  # Scaffold a new deck directory: config.yml plus empty slides/ and images/.
  # Returns the new Presentation.
  def self.create!(slug:, title: nil, theme: "minimal", mode: "dark", body_size: "medium")
    slug = slug.to_s.strip
    raise ArgumentError, "slug is required" if slug.empty?
    raise ArgumentError, "slug may not contain a path separator" if slug.include?("/")

    dir = ROOT.join(slug)
    raise ArgumentError, "#{slug} already exists" if dir.exist?

    dir.join("slides").mkpath
    dir.join("images").mkpath

    presentation = load(slug)
    presentation.update_config!(
      title: title,
      theme: theme,
      mode: mode,
      body_size: body_size,
      fonts: {},
      colors: {}
    )
    presentation
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
    @body_size = BODY_SIZES.include?(config["body_size"]) ? config["body_size"] : "medium"
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
      "--md-body-scale" => BODY_SIZE_SCALES.fetch(@body_size),
      "--md-font-heading" => %("#{fonts['heading']}", #{SANS_FALLBACK}),
      "--md-font-body" => %("#{fonts['body']}", #{SANS_FALLBACK}),
      "--md-font-mono" => %("#{fonts['mono']}", #{MONO_FALLBACK})
    }
  end

  # Slides grouped into chapters. A `chapter:` marker is STICKY: the slide
  # carrying it opens a chapter and every following slide inherits it until the
  # next marker, so a group costs one line rather than one per slide. Slides
  # ahead of the first marker come back as a single unnamed leading chapter.
  def chapters
    groups = []

    slides.each do |slide|
      # A marker always opens a new group, even when it repeats the current
      # name — "start a chapter here" is what the author asked for. The leading
      # unnamed run needs a group to live in too.
      groups << Chapter.new(name: slide.chapter, slug: nil, slides: []) if slide.chapter || groups.empty?
      groups.last.slides << slide
    end

    assign_chapter_slugs(groups)
    groups
  end

  def named_chapters
    chapters.select(&:named?)
  end

  def find_chapter(chapter_slug)
    named_chapters.find { |chapter| chapter.slug == chapter_slug }
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
  # `stem` names the file after its NN- prefix, e.g. stem: "pricing-chart"
  # gives "07-pricing-chart.md". Returns the new Slide object.
  def create_slide!(after_position: nil, body: nil, stem: "slide")
    slides_dir.mkpath
    stem = stem.to_s.strip.parameterize.presence || "slide"
    prefix = next_slide_prefix
    path = slides_dir.join("#{prefix}-#{stem}.md")
    path.binwrite(body || NEW_SLIDE_BODY)

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
      # preserve_chapters: false — a brand new slide carries no marker, so letting
      # it inherit from the slide above puts it in the chapter it was inserted
      # into, while every existing marker stays on its own slide.
      reorder!(order, preserve_chapters: false)
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
  def reorder!(new_order_positions, preserve_chapters: true)
    unless new_order_positions.sort == (1..slides.size).to_a
      raise ArgumentError, "expected a permutation of 1..#{slides.size}, got #{new_order_positions.inspect}"
    end

    # Chapter membership has to follow the SLIDES, not their positions. The
    # `chapter:` marker lives on whichever slide opens the chapter, so reordering
    # within a chapter would otherwise hand the marker to a different slide and
    # move the boundary instead of the slides — flipping a two-slide chapter left
    # one slide stranded in the chapter above, with no way to undo it by dragging.
    chapters_before = preserve_chapters ? chapters.flat_map { |c| Array.new(c.size, c.name) } : nil

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

    if chapters_before
      names = new_order_positions.map { |old_pos| chapters_before[old_pos - 1] }
      apply_chapters!(rehome_moved_slide(names, single_move_index(new_order_positions)))
    end

    slides
  end

  # Rewrite `chapter:` markers so that slide N belongs to `names[N - 1]`, with
  # the first slide of each contiguous run carrying the marker and the rest
  # inheriting it. Only slides whose marker actually changes are written.
  def apply_chapters!(names)
    previous = nil
    changed = false

    slides.each_with_index do |slide, idx|
      wanted = names[idx]
      marker = wanted && wanted != previous ? wanted : nil
      previous = wanted
      next if slide.chapter == marker

      slide.write!(Slide.with_front_matter(slide.markdown, key: "chapter", value: marker))
      changed = true
    end

    reload_slides! if changed
    slides
  end

  def reload_slides!
    @slides = load_slides
  end

  def config_path
    @dir.join("config.yml")
  end

  # Persist deck-level settings back to config.yml, preserving any other
  # keys already there (e.g. title). Mirrors Slide#write!'s tmp+rename.
  def update_config!(theme:, mode:, fonts:, colors:, body_size: "medium", title: nil)
    raise ArgumentError, "invalid theme (one of: #{THEMES.join(', ')})" unless THEMES.include?(theme)
    raise ArgumentError, "invalid mode (one of: #{MODES.join(', ')})" unless MODES.include?(mode)
    raise ArgumentError, "invalid body_size (one of: #{BODY_SIZES.join(', ')})" unless BODY_SIZES.include?(body_size)

    raw = config_path.exist? ? (YAML.safe_load(config_path.read) || {}) : {}
    raw["title"] = title if title.present?
    raw["theme"] = theme
    raw["mode"] = mode
    raw["body_size"] = body_size
    raw["fonts"] = fonts
    raw["colors"] = colors

    tmp = config_path.dirname.join("#{config_path.basename}.tmp.#{Process.pid}.#{SecureRandom.hex(4)}")
    tmp.write(YAML.dump(raw))
    tmp.rename(config_path)

    @title = title if title.present?
    @theme = theme
    @mode = mode
    @body_size = body_size
    @fonts = DEFAULT_FONTS.merge(fonts)
    @colors = default_colors_for_mode.merge(colors)
  end

  private

  # New index of the single slide a drag moved, or nil when the permutation isn't
  # one slide changing place (identity, or something hand-rolled). An adjacent
  # swap is ambiguous — "A moved down" and "B moved up" describe it equally — and
  # either reading normalizes the same way, so the first match is fine.
  def single_move_index(order)
    return nil if order == order.sort

    (0...order.size).find do |i|
      rest = order.dup.tap { |o| o.delete_at(i) }
      rest == rest.sort
    end
  end

  # Strict per-slide preservation keeps the moved slide's old chapter even when
  # it has been dropped somewhere that contradicts it — inside another chapter
  # (which would split that chapter into two runs with the same name), or above
  # every chapter, where a sticky marker would drag the slides below it into a
  # chapter they were never in. Only the slide that actually moved is re-homed;
  # every other slide keeps exactly what it had.
  def rehome_moved_slide(names, moved_index)
    return names if moved_index.nil? || names.size < 2

    before = moved_index.positive? ? names[moved_index - 1] : :none
    after = moved_index < names.size - 1 ? names[moved_index + 1] : :none
    own = names[moved_index]
    return names if own == before || own == after

    names = names.dup
    # No slide above means nothing to inherit from, so follow the slide below;
    # otherwise inherit from above, which is what a marker-less slide does anyway.
    names[moved_index] = before == :none ? after : before
    names
  end

  # URL-safe ids for chapter links. Two chapters can legitimately carry the
  # same name (or names that parameterize identically), so collisions get a
  # numeric suffix in document order — stable as long as the names are.
  def assign_chapter_slugs(groups)
    seen = Hash.new(0)

    groups.each do |group|
      next unless group.named?

      base = group.name.parameterize.presence || "chapter"
      seen[base] += 1
      group.slug = seen[base] > 1 ? "#{base}-#{seen[base]}" : base
    end
  end

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
