require "commonmarker"
require "rouge"
require "nokogiri"

class MarkdownRenderer
  COMMONMARKER_OPTIONS = {
    parse: { smart: true },
    render: { hardbreaks: false, unsafe: true },
    extension: {
      table: true,
      strikethrough: true,
      autolink: true,
      tasklist: true,
      footnotes: true,
      header_ids: "slide-",
      alerts: true
    }
  }.freeze

  def self.render(markdown, image_base: nil)
    new(markdown, image_base: image_base).render
  end

  def initialize(markdown, image_base: nil)
    @markdown = markdown.to_s
    @image_base = image_base
  end

  def render
    html = Commonmarker.to_html(@markdown, options: COMMONMARKER_OPTIONS, plugins: nil)
    post_process(html)
  end

  private

  ABSOLUTE_URL = /\A([a-z][a-z0-9+.-]*:|\/|#|data:)/i

  def post_process(html)
    fragment = Nokogiri::HTML5.fragment(html)

    fragment.css("pre").each do |pre|
      code = pre.at_css("code")
      next unless code

      lang = pre["lang"] || code["class"]&.match(/language-(\S+)/)&.[](1)

      if lang == "mermaid"
        replace_with_mermaid(pre, code.content)
      elsif lang.present?
        replace_with_highlight(pre, code.content, lang)
      end
    end

    rewrite_image_urls(fragment) if @image_base

    fragment.to_html
  end

  def rewrite_image_urls(fragment)
    fragment.css("img").each do |img|
      src = img["src"]
      next if src.nil? || src.empty? || src.match?(ABSOLUTE_URL)

      # Strip a leading "images/" or "./images/" so the importer's output
      # and hand-written ![](images/foo.png) both resolve.
      relative = src.sub(/\A\.?\/?images\//, "")
      img["src"] = "#{@image_base}/#{relative}"
    end
  end

  def replace_with_mermaid(pre, source)
    new_node = Nokogiri::HTML5.fragment(
      %(<pre class="mermaid">#{html_escape(source)}</pre>)
    )
    pre.replace(new_node)
  end

  def replace_with_highlight(pre, source, lang)
    lexer = Rouge::Lexer.find(lang) || Rouge::Lexers::PlainText.new
    formatter = Rouge::Formatters::HTML.new
    highlighted = formatter.format(lexer.lex(source))

    new_html = %(<pre class="highlight language-#{lang}"><code>#{highlighted}</code></pre>)
    pre.replace(Nokogiri::HTML5.fragment(new_html))
  end

  def html_escape(text)
    ERB::Util.html_escape(text)
  end
end
