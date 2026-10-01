# Slide formatting

Markdown syntax supported (tables, code fences, images, etc).

## Extras

- **Front matter** (top of file, YAML, only these 4 keys):
  ```
  ---
  center: true
  label: Intro
  part: Week 1
  chapter: Setup
  ---
  ```
- **`center: true`** — vertically/horizontally centers the slide content. Legacy equivalent: `<!-- center -->` anywhere in the body.
- **`label`** — short name shown in the overview grid / palette instead of the slide's heading.
- **`chapter`** — opens a named section. **Sticky**: the slide carrying the key starts the chapter and every following slide belongs to it until the next `chapter:` marker, so a section costs one line rather than one per slide. Slides before the first marker stay ungrouped.

  Chapters give you three things: collapsible section headers in the overview grid, groupings in the ⌘K palette (and the name becomes searchable, so "unix" pulls up the whole section), and a **Present section →** link that scopes presenting to just those slides — arrow keys stop at the section edges and the counter reads `2 / 6`. That link is a normal URL (`/presentations/<deck>/chapters/<chapter-slug>`), so it's worth bookmarking for a single lecture.

  Reordering slides keeps them in their chapter, so you can freely rearrange within a section; dragging a slide into a different section moves it there. To reorder the sections themselves, drag a section's header onto another header — the whole section moves, keeping its slides and their order.

  Easiest way to manage them is the overview grid: hover any slide for **+ chapter**, click a chapter name to rename it, or click its **×** to remove the marker — which keeps the slide and folds it into the section above. From the CLI:

  ```sh
  bin/deck chapters welcome              # sections with their slide ranges
  bin/deck chapter welcome 6 "Week 6"    # start a section at slide 6
  bin/deck unchapter welcome 6           # remove the marker, keep the slide
  ```
- **`part`** — the level above chapters: a part holds chapters, the way a week holds the sections taught in it. **Sticky** like `chapter:`, and a part marker also **closes the running chapter** — chapters never span two parts, and slides after a part marker belong to no chapter until the next `chapter:` marker. A slide can carry both keys to open a part and its first chapter at once.

  Parts get a heavier header above their chapter headers in the overview (collapsing it hides the whole part), a level above chapters in the ⌘K palette ("week 1" pulls up the whole part), and a **Present part →** link at `/presentations/<deck>/parts/<part-slug>`. Printing from that link (⌘P → Save as PDF) exports just the part — the same works from a chapter's **Present section →** link. While presenting, the progress ring and counter track the current part — `22 / 27` is slide 22 of the week, not the deck — or the current chapter for slides outside any part.

  Dragging a slide into another part moves it into that part and chapter. Chapter headers can be dragged or nudged only within their own part. From the CLI:

  ```sh
  bin/deck parts welcome                 # parts, their chapters, and slide ranges
  bin/deck part welcome 1 "Week 1"       # start a part at slide 1
  bin/deck unpart welcome 1              # remove the marker, keep the slide
  ```
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
