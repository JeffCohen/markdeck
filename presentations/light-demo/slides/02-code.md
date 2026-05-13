## Syntax highlighting adapts

```ruby
class Presentation
  def self.find(slug)
    config = YAML.safe_load(config_path.read)
    new(slug: slug, config: config)
  end

  attr_reader :mode  # "light" or "dark"
end
```

Comments are slate, keywords are red, strings emerald, classes blue.
