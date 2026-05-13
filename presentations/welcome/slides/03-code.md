## Code-heavy slides

```ruby
class Presentation
  def self.find(slug)
    dir = ROOT.join(slug)
    return nil unless dir.directory?
    load(slug)
  end
end
```

Code is highlighted by **Rouge** server-side — no JS required.

<!-- notes
Rouge runs on the server during render — no client-side highlight pass,
so even huge code blocks paint instantly.

The palette adapts to `mode: light | dark` — different color sets, same markup.
-->

