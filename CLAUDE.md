# Markdeck

A Rails 8 app for writing and presenting slide decks in Markdown. **There is no database** — ActiveRecord isn't even loaded. Every deck is a directory on disk and the app re-reads it on each request, so file edits show up on the next page load.

```
presentations/<slug>/
  config.yml          title, theme, mode, body_size, fonts, colors
  slides/01-intro.md  order comes from the sorted NN- filename prefix
  images/             referenced as ![](images/foo.png)
```

The three models in `app/models` are plain Ruby wrappers over those files: `Presentation` (a directory), `Slide` (one `.md` file), and `MarkdownRenderer` (Commonmarker + Nokogiri post-processing).

## Working on decks

**Use `bin/deck` for anything structural** — creating decks, adding, reordering, deleting slides, and changing settings. Run `bin/deck` with no arguments for the full command list. It wraps `Presentation#reorder!`, `#create_slide!`, and `#update_config!`, which handle collision-safe multi-file renames under a lock and validate the config schema. Don't hand-rename `NN-` prefixes or hand-edit `config.yml`.

```sh
bin/deck list                                  # all decks
bin/deck list welcome                          # slides with their positions
bin/deck cat welcome 3                         # read slide 3
printf '# Title\n' | bin/deck add welcome --after=2 --stem=agenda --file=-
bin/deck mv welcome 7 2
bin/deck set welcome theme=aurora mode=light
bin/deck validate welcome                      # run this after editing a deck
```

**Edit slide content directly** — `slides/*.md` are just Markdown files; use normal file edits for prose, and `bin/deck validate <slug>` afterwards to catch silently-ignored front matter and missing images.

**Read `FORMATTING.md` before writing slide bodies.** It documents the non-obvious authoring syntax: speaker notes, `center`/`label`/`chapter` front matter, mermaid fences, `.fill` images, multi-column blocks, and the theme-color spans. Getting these wrong fails silently rather than erroring.

Constraints worth remembering:

- Themes: `minimal`, `editorial`, `terminal`, `aurora`. Modes: `dark`, `light`. Body sizes: `small`, `medium`, `large`. Anything else falls back to a default without complaint.
- Front matter reads **only** `center`, `label`, and `chapter`. Other keys are dropped.
- Slide positions in `bin/deck` are 1-based.
- Prefix gaps and letter suffixes (`06a-columns.md`) are fine — ordering is a basename sort. `bin/deck renumber` normalizes them only if you want that.
- One deck slug contains a space (`MPCS 51042`), so quote slug arguments.

## Running it

`bin/dev` runs the server plus the Tailwind watcher (`Procfile.dev`). Tailwind v4; the theme system lives in `app/assets/tailwind/application.css`. Front end is Hotwire over importmaps — Stimulus controllers in `app/javascript/controllers` cover the deck viewer, editor, overview grid, jump palette, and settings dialog.

Controllers stay strictly RESTful — the canonical 7 actions only. Operations that would otherwise be non-REST get their own resource (`slide_orders`, `presentations/settings`, `presentations/previews`); follow that pattern rather than adding a custom action.

There is currently no test suite; `test/` is empty. Prefer minitest if adding one.
