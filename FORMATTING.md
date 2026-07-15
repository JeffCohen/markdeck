# Slide formatting

Markdown syntax supported (tables, code fences, images, etc).

## Extras

- **Front matter** (top of file, YAML, only these 3 keys):
  ```
  ---
  center: true
  label: Intro
  chapter: Setup
  ---
  ```
- **`center: true`** — vertically/horizontally centers the slide content. Legacy equivalent: `<!-- center -->` anywhere in the body.
- **`label`** — short name shown in the overview grid / palette instead of the slide's heading.
- **`chapter`** — groups slides under a section name (overview grid).
- **Speaker notes**: `<!-- notes ... -->` — stripped from the rendered slide, shown via the notes peek (`N` key).
- **Mermaid diagrams**: fence with `mermaid` as the language:
  ````
  ```mermaid
  graph TD; A-->B;
  ```
  ````
- **Images**: `![](images/foo.png)` — relative to the deck's `images/` folder.
- **Code blocks**: fence with a language tag for syntax highlighting, e.g. ` ```ruby `.
