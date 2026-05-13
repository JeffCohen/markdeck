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

  def self.render(markdown)
    new(markdown).render
  end

  def initialize(markdown)
    @markdown = markdown.to_s
  end

  def render
    html = Commonmarker.to_html(@markdown, options: COMMONMARKER_OPTIONS, plugins: nil)
    post_process(html)
  end

  private

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

    fragment.to_html
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
