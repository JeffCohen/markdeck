ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"
require "tmpdir"

class ActiveSupport::TestCase
  # A throwaway deck on disk: one slide per body, in order. Built directly
  # rather than through Presentation.find so tests never touch presentations/.
  def build_deck(*bodies)
    dir = Pathname(Dir.mktmpdir("deck"))
    dir.join("slides").mkpath
    bodies.each_with_index do |body, i|
      dir.join("slides", format("%02d-slide.md", i + 1)).write(body)
    end
    @tmp_dirs = (@tmp_dirs || []) << dir
    Presentation.new(slug: "test", dir: dir, config: {})
  end

  # Slide markdown titled `title`, with optional `part:` / `chapter:` markers.
  def slide(title, part: nil, chapter: nil)
    body = "# #{title}\n"
    body = Slide.with_front_matter(body, key: "part", value: part) if part
    body = Slide.with_front_matter(body, key: "chapter", value: chapter) if chapter
    body
  end

  teardown do
    Array(@tmp_dirs).each { |dir| FileUtils.rm_rf(dir) }
  end
end
