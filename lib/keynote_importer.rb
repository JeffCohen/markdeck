require "fileutils"
require "tmpdir"
require "yaml"

class KeynoteImporter
  APPLESCRIPT_PATH = File.expand_path("keynote_importer/extract.applescript", __dir__)

  def initialize(key_path, name)
    @key_path = File.expand_path(key_path)
    @name = name
    @presentations_dir = Rails.root.join("presentations", @name).to_s
    @slides_dir = File.join(@presentations_dir, "slides")
    @images_dir = File.join(@presentations_dir, "images")
  end

  def run
    abort "File not found: #{@key_path}" unless File.exist?(@key_path)
    if File.exist?(@presentations_dir)
      if ENV["FORCE"] == "1"
        FileUtils.rm_rf(@presentations_dir)
      else
        abort "Destination already exists: #{@presentations_dir} (re-run with FORCE=1 to overwrite)"
      end
    end

    Dir.mktmpdir("keynote-import-") do |tmpdir|
      data_dir = File.join(tmpdir, "data")
      img_dir = File.join(tmpdir, "images")
      FileUtils.mkdir_p([data_dir, img_dir])

      puts "Extracting from #{@key_path}…"
      run_applescript(data_dir, img_dir)

      manifest = File.join(data_dir, "manifest.txt")
      abort "Extraction produced no manifest — Keynote likely failed to open the file" unless File.exist?(manifest)

      FileUtils.mkdir_p([@slides_dir, @images_dir])
      image_map = copy_images(data_dir, img_dir)
      build_slide_files(data_dir, image_map)
      write_config
    end

    puts "Created presentation at presentations/#{@name}"
  end

  private

  def run_applescript(data_dir, img_dir)
    system("osascript", APPLESCRIPT_PATH, @key_path, data_dir, img_dir) ||
      abort("osascript failed (exit #{$?.exitstatus})")
  end

  # Returns a hash: slide_number_string (zero-padded) => image_relative_path.
  # Keynote's "slide images" export silently omits skipped slides regardless
  # of the skipped-slides flag, so we pair the exported PNGs (in order) with
  # the non-skipped slides identified from meta files.
  def copy_images(data_dir, img_dir)
    pngs = Dir.glob("#{img_dir}/**/*.png").sort
    non_skipped = non_skipped_slide_numbers(data_dir)

    if pngs.size != non_skipped.size
      warn "Image-export count (#{pngs.size}) does not match non-skipped slide count (#{non_skipped.size}); image-to-slide mapping may be off."
    end

    map = {}
    pngs.zip(non_skipped).each do |src, num|
      break if num.nil?
      dst = File.join(@images_dir, "slide-#{num}.png")
      FileUtils.cp(src, dst)
      map[num] = "images/slide-#{num}.png"
    end
    map
  end

  def non_skipped_slide_numbers(data_dir)
    Dir.glob("#{data_dir}/slide-*-meta.txt").sort.filter_map do |path|
      num = path[/slide-(\d+)-meta/, 1]
      skipped = File.read(path).include?("skipped=true")
      skipped ? nil : num
    end
  end

  def build_slide_files(data_dir, image_map)
    slide_nums = Dir.glob("#{data_dir}/slide-*-meta.txt")
                    .map { |f| f[/slide-(\d+)-meta/, 1] }
                    .sort
    slide_nums.each { |num| build_slide_file(data_dir, num, image_map[num]) }
  end

  def build_slide_file(data_dir, num, image_rel_path)
    title = read_optional(data_dir, "slide-#{num}-title.txt")
    body  = read_optional(data_dir, "slide-#{num}-body.txt")
    notes = read_optional(data_dir, "slide-#{num}-notes.txt")
    tables = Dir.glob("#{data_dir}/slide-#{num}-table-*.tsv").sort

    parts = []

    if title && !title.strip.empty?
      first, *rest = title.strip.split(/\r?\n/)
      parts << "# #{first}"
      rest.each { |line| parts << line unless line.strip.empty? }
    end

    if body && !body.strip.empty?
      bullets = body.split(/\r?\n/)
                    .reject { |l| l.strip.empty? }
                    .map    { |l| "- #{l.strip}" }
      parts << bullets.join("\n")
    end

    tables.each { |tsv| parts << tsv_to_gfm(File.read(tsv)) }

    has_text_content = !parts.empty?

    if image_rel_path
      if has_text_content
        parts << "<!-- visual fallback:\n![](#{image_rel_path})\n-->"
      else
        parts << "![](#{image_rel_path})"
      end
    end

    if notes && !notes.strip.empty?
      parts << "<!-- notes\n#{notes.strip}\n-->"
    end

    # Skip writing slides that have no extractable content at all.
    return if parts.empty?

    # For image-only slides, prepend a front-matter `label` so the slide has a
    # readable name in the editor's Overview and Cmd+K palette from day one.
    prefix = !has_text_content && image_rel_path ? "---\nlabel: Slide #{num.to_i}\n---\n\n" : ""

    out_path = File.join(@slides_dir, "#{num}-slide.md")
    File.write(out_path, prefix + parts.join("\n\n") + "\n")
  end

  def read_optional(dir, name)
    path = File.join(dir, name)
    File.exist?(path) ? File.read(path) : nil
  end

  def tsv_to_gfm(tsv)
    rows = tsv.split(/\r?\n/).reject(&:empty?).map { |r| r.split("\t") }
    return "" if rows.empty?
    cols = rows.map(&:size).max
    rows = rows.map { |r| r + [""] * (cols - r.size) }
    header, *body = rows
    out = []
    out << "| #{header.join(' | ')} |"
    out << "| #{(['---'] * cols).join(' | ')} |"
    body.each { |r| out << "| #{r.join(' | ')} |" }
    out.join("\n")
  end

  def write_config
    title = @name.tr("_-", "  ").split.map(&:capitalize).join(" ")
    config = {
      "title"  => title,
      "theme"  => "minimal",
      "fonts"  => {
        "heading" => "Manrope",
        "body"    => "Inter",
        "mono"    => "JetBrains Mono"
      }
    }
    File.write(File.join(@presentations_dir, "config.yml"), config.to_yaml)
  end
end
