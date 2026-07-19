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
- **Speaker notes**: stripped from the rendered slide, shown via the notes peek (`N` key). Two forms:
  ```
  <!-- notes wrapped inline text -->
  ```
  ```
  <!-- notes -->
  Marker form — everything after it, to the end of the slide, is notes.
  Put it last (matches the `<!-- col -->` marker convention).
  ```
- **Mermaid diagrams**: fence with `mermaid` as the language:
  ````
  ```mermaid
  graph TD; A-->B;
  ```
  ````
- **Images**: `![](images/foo.png)` — relative to the deck's `images/` folder. By default, capped at `max-height: 60vh`. For a full slide image, use raw HTML instead (plain `![]()` can't carry a class) with one of:
  ```
  <img src="images/foo.png" class="fill" />
  ```
  True edge-to-edge — ignores the slide's own padding and the content column's max-width.
  ```
  # A heading

  <img src="images/foo.png" class="fill-below" />
  ```
  Fills whatever vertical space is left below the preceding content (e.g. a heading) instead of the whole slide. Both use `object-fit: cover` (crops to fill without distorting) — swap to `object-contain` inline if you'd rather letterbox.
- **Code blocks**: fence with a language tag for syntax highlighting, e.g. ` ```ruby `.
- **Multi-column layouts**: wrap the whole block in `<div class="cols">` (2 columns) or `<div class="cols-3">` (3 columns), and mark where each column ends with `<!-- col -->` on its own line:
  ```
  <div class="cols">

  ### Backend
  - Rails 8

  <!-- col -->

  ### Frontend
  - Tailwind 4

  </div>
  ```
  Without a `<!-- col -->` marker, everything inside `.cols` is one column — that's the columns-of-uneven-height trap to watch for.

  For finer control over an individual column (e.g. it needs its own nested HTML), you can instead hand-write each column as its own `<div>...</div>` inside `.cols`, leaving a blank line just inside every `<div>` so the markdown in between still renders. See `presentations/welcome/slides/06a-columns.md` for a working example.
- **Deck palette colors inline**: wrap text in a `<span>` to pull the deck's own theme colors into your prose:
  ```
  <span class="accent">accent-colored text</span>
  <span class="muted">de-emphasized text</span>
  <span class="fg">explicit foreground</span>
  <span class="bg">explicit background (rare — sets text color, not a fill)</span>
  <span class="highlight">second general-purpose text color</span>
  ```
  These track whatever `theme`/`mode`/custom colors the deck is set to — no hardcoded hex needed. All five (`bg`/`fg`/`accent`/`muted`/`highlight`) are editable per-deck from the Settings dialog's color swatches.
  Regular Tailwind utility classes work too (e.g. `text-teal-400`, `mt-8`) — they'll override these defaults since they come from Tailwind's `utilities` layer.
