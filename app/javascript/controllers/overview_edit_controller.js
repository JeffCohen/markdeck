import { Controller } from "@hotwired/stimulus"

// Deck landing page grid: drag-to-reorder, +Add tile, per-tile delete.
export default class extends Controller {
  static targets = ["tile", "add", "chapterHeader", "partHeader"]
  static values  = {
    slug:       String,
    createUrl:  String,
    reorderUrl: String,
  }

  connect() {
    this._dragFromPos = null
    this._dragChapterSlug = null
    this._applyCollapsed()
    // Listeners first: _selectIncomingSlide() focuses a tile, and the focusin
    // handler below is what turns focus into a visible selection.
    this._listenForSelection()
    this._selectIncomingSlide()

    window.addEventListener("resize", this._onResize = () => this._scaleThumbs())
    this._scaleThumbs()

    // Safety net for drag state. dragend fires on the source tile, so a drag
    // abandoned over a grid gap or released outside the window could leave a
    // tile stuck with is-drop-target — whose dashed ring is the same width and
    // colour as the focus ring, so it reads as a second focused slide.
    this._onDragFinish = () => this._clearDragState()
    window.addEventListener("dragend", this._onDragFinish)
    window.addEventListener("drop", this._onDragFinish)
  }

  _listenForSelection() {
    // Arriving with a different #N while already on this page is a same-document
    // navigation: connect() doesn't re-run, so re-select explicitly.
    window.addEventListener("hashchange", this._onHashChange = () => this._selectIncomingSlide())

    // There is ONE selection and it follows focus, so arrowing away from the
    // slide you arrived on moves the marker rather than leaving two tiles
    // looking selected. Driven by focusin rather than patched into handleKey so
    // every route — arrows, Home/End, Tab into a tile's buttons — stays in sync.
    this.element.addEventListener("focusin", this._onFocusIn = (e) => {
      const tile = e.target.closest?.('[data-overview-edit-target="tile"]')
      if (tile) {
        this._setCurrent(tile)
      } else if (this.hasAddTarget && this.addTarget.contains(e.target)) {
        // "+ new slide" isn't a slide; nothing should read as selected.
        this._setCurrent(null)
      }
      // Anything else (⌘K palette, settings dialog) leaves the selection alone.
    })
  }

  _setCurrent(tile) {
    this.tileTargets.forEach(t => {
      const isCurrent = t === tile
      t.classList.toggle("is-current", isCurrent)
      if (isCurrent) {
        t.setAttribute("aria-current", "true")
      } else {
        t.removeAttribute("aria-current")
      }
    })
  }

  disconnect() {
    window.removeEventListener("resize", this._onResize)
    window.removeEventListener("dragend", this._onDragFinish)
    window.removeEventListener("drop", this._onDragFinish)
    window.removeEventListener("hashchange", this._onHashChange)
    this.element.removeEventListener("focusin", this._onFocusIn)
  }

  _clearDragState() {
    this.tileTargets.forEach(t => t.classList.remove("is-dragging", "is-drop-target"))
    this.chapterHeaderTargets.forEach(h => h.classList.remove("is-dragging", "is-drop-target"))
    this._dragFromPos = null
    this._dragChapterSlug = null
    this._dragChapterPart = null
  }

  // Slide tiles plus the trailing "+ new slide" tile, in grid order. Tiles inside
  // a collapsed chapter are excluded: arrow keys shouldn't move focus to
  // something invisible, and a display:none tile reports a zero-sized box, which
  // would corrupt the row geometry _verticalTarget() measures.
  _items() {
    const tiles = this.tileTargets.filter(t => t.offsetParent !== null)
    return this.hasAddTarget ? [...tiles, this.addTarget] : tiles
  }

  // Present mode (O / "← overview") and the editor crumb both arrive with #N;
  // that sets where the selection STARTS. Focusing is what marks it, via the
  // focusin handler — and the marker class is what makes it visible at all,
  // since a programmatic focus() on a fresh page load doesn't satisfy
  // :focus-visible, so the focus ring alone would draw nothing.
  _selectIncomingSlide() {
    const target = this._tileFromHash() || this._items()[0]
    if (!target) return

    // Mark explicitly rather than leaning on the focusin handler: a document
    // that doesn't have focus yet (page still loading, or opened in a background
    // tab) updates activeElement without dispatching focus events, which would
    // leave the deck looking like nothing is selected until you pressed a key.
    this._setCurrent(this.tileTargets.includes(target) ? target : null)
    target.focus()
    target.scrollIntoView({ block: "nearest" })
  }

  _tileFromHash() {
    const match = window.location.hash.match(/^#(\d+)$/)
    if (!match) return null

    const tile = this.tileTargets.find(t => t.dataset.position === match[1])
    if (!tile) return null

    // Never focus something invisible: if the slide sits in a collapsed
    // chapter or part, open it rather than silently focusing a hidden tile.
    if (tile.offsetParent === null && (tile.dataset.chapterSlug || tile.dataset.partSlug)) {
      const collapsed = this._collapsed()
      collapsed.delete(tile.dataset.chapterSlug)
      collapsed.delete(this._partKey(tile.dataset.partSlug))
      this._saveCollapsed(collapsed)
      this._applyCollapsed()
      this._scaleThumbs()
    }

    return tile
  }

  // ---- parts & chapters: collapse --------------------------------------------

  // Collapsed chapters and parts live in localStorage per deck — there's no
  // database, and this is view state that shouldn't touch the slide files.
  // Parts share the set under a "part:" prefix so their slugs can't collide
  // with chapter slugs.
  get _collapseKey() {
    return `markdeck:collapsed:${this.slugValue}`
  }

  _collapsed() {
    try {
      const raw = localStorage.getItem(this._collapseKey)
      return new Set(raw ? JSON.parse(raw) : [])
    } catch {
      return new Set()
    }
  }

  _saveCollapsed(set) {
    try {
      localStorage.setItem(this._collapseKey, JSON.stringify([...set]))
    } catch (err) {
      console.warn("could not persist collapsed chapters:", err)
    }
  }

  _partKey(slug) {
    return `part:${slug}`
  }

  togglePart(e) {
    e.stopPropagation()
    this._toggleCollapsed(this._partKey(e.currentTarget.dataset.partSlug))
  }

  toggleChapter(e) {
    e.stopPropagation()
    this._toggleCollapsed(e.currentTarget.dataset.chapterSlug)
  }

  _toggleCollapsed(slug) {
    const collapsed = this._collapsed()
    collapsed.has(slug) ? collapsed.delete(slug) : collapsed.add(slug)
    this._saveCollapsed(collapsed)
    this._applyCollapsed()
    // Tiles that just became visible had no layout box, so never got scaled.
    this._scaleThumbs()
  }

  _applyCollapsed() {
    const collapsed = this._collapsed()
    const partCollapsed = (slug) => !!slug && collapsed.has(this._partKey(slug))

    this.tileTargets.forEach(tile => {
      const slug = tile.dataset.chapterSlug
      tile.classList.toggle("is-collapsed",
        (!!slug && collapsed.has(slug)) || partCollapsed(tile.dataset.partSlug))
    })

    this.chapterHeaderTargets.forEach(header => {
      this._setToggle(header, collapsed.has(header.dataset.chapterSlug))
      header.classList.toggle("is-hidden", partCollapsed(header.dataset.partSlug))
    })

    this.partHeaderTargets.forEach(header => {
      this._setToggle(header, partCollapsed(header.dataset.partSlug))
    })
  }

  _setToggle(header, isCollapsed) {
    header.classList.toggle("is-collapsed", isCollapsed)
    const toggle = header.querySelector(".overview-chapter__toggle")
    if (toggle) {
      toggle.setAttribute("aria-expanded", String(!isCollapsed))
      toggle.textContent = isCollapsed ? "▸" : "▾"
    }
  }

  // ---- parts & chapters: markers ---------------------------------------------

  startChapter(e) {
    e.stopPropagation()
    this._editMarkerName("chapter", e.currentTarget, "")
  }

  renameChapter(e) {
    e.stopPropagation()
    this._editMarkerName("chapter", e.currentTarget.closest(".overview-edit__chapter"), e.currentTarget.textContent.trim())
  }

  async clearChapter(e) {
    e.stopPropagation()
    await this._writeMarker("chapter", e.currentTarget.dataset.position, null)
  }

  startPart(e) {
    e.stopPropagation()
    this._editMarkerName("part", e.currentTarget, "")
  }

  renamePart(e) {
    e.stopPropagation()
    this._editMarkerName("part", e.currentTarget.closest(".overview-edit__chapter"), e.currentTarget.textContent.trim())
  }

  async clearPart(e) {
    e.stopPropagation()
    await this._writeMarker("part", e.currentTarget.dataset.position, null)
  }

  // Swap the control for a text input rather than using prompt(), which blocks
  // the page and looks nothing like the rest of the UI. Enter commits, Escape
  // or blurring without a change puts the original control back.
  _editMarkerName(kind, control, current) {
    const position = control.dataset.position || control.querySelector("[data-position]")?.dataset.position
    const noun = kind === "part" ? "Part name" : "Chapter name"
    const input = document.createElement("input")
    input.type = "text"
    input.className = "overview-edit__chapter-input"
    input.value = current
    input.placeholder = noun
    input.setAttribute("aria-label", noun)

    let settled = false
    const restore = () => {
      if (settled) return
      settled = true
      input.replaceWith(control)
    }
    const commit = () => {
      if (settled) return
      const name = input.value.trim()
      if (!name || name === current) return restore()
      settled = true
      this._writeMarker(kind, position, name)
    }

    input.addEventListener("keydown", (ev) => {
      ev.stopPropagation()
      if (ev.key === "Enter") { ev.preventDefault(); commit() }
      if (ev.key === "Escape") { ev.preventDefault(); restore() }
    })
    input.addEventListener("blur", commit)
    input.addEventListener("click", (ev) => ev.stopPropagation())

    control.replaceWith(input)
    input.focus()
    input.select()
  }

  // PATCH with a name opens a part or chapter at that slide; DELETE removes the
  // marker. Either way the grouping is derived from the files, so reload to
  // re-render. `kind` is "part" or "chapter" — both the URL and the param key.
  async _writeMarker(kind, position, name) {
    const url = `/presentations/${encodeURIComponent(this.slugValue)}/slides/${position}/${kind}`
    try {
      const res = await fetch(url, {
        method: name === null ? "DELETE" : "PATCH",
        headers: { "Content-Type": "application/json", "Accept": "application/json", "X-CSRF-Token": csrfToken() },
        body: name === null ? undefined : JSON.stringify({ [kind]: { name } }),
      })
      if (!res.ok) throw new Error(`${kind} HTTP ${res.status}`)
      window.location.reload()
    } catch (err) {
      console.warn(`${kind} update failed:`, err)
      alert(`Could not update the ${kind} — see console.`)
    }
  }

  // .overview-edit__thumb's CSS default (scale(0.18)) is only a rough
  // approximation — the grid's columns are responsive, so a tile's actual
  // width rarely matches what 0.18 assumes. Anchored top-left, any mismatch
  // shows up as a gap on the bottom/right, invisible on text but obvious on
  // a full-bleed image. Rescale each tile to its real rendered width, same
  // trick as the editor preview and next-slide peek.
  _scaleThumbs() {
    const VIRTUAL_WIDTH = 1280
    this.element.querySelectorAll(".overview-edit__thumb-frame").forEach(frame => {
      const thumb = frame.querySelector(".overview-edit__thumb")
      const w = frame.clientWidth
      if (thumb && w > 0) thumb.style.transform = `scale(${w / VIRTUAL_WIDTH})`
    })
  }

  stopPropagation(e) { e.stopPropagation() }

  // Tile click → enter present mode at that slide.
  presentSlide(e) {
    if (e.target.closest(".overview-edit__delete, .overview-edit__edit-pill, .overview-edit__chapter, .overview-edit__chapter-input")) return
    const pos = e.currentTarget.dataset.position
    window.location = `/presentations/${this.slugValue}/slides/${pos}`
  }

  // Arrow keys move focus between tiles in the grid; Enter/Space activates
  // the focused tile (same as clicking it).
  handleKey(e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return
    const items = this._items()
    if (!items.length) return
    const current = items.indexOf(document.activeElement)

    if (e.key === "Enter" || e.key === " ") {
      if (current === -1) return
      e.preventDefault()
      items[current].click()
      return
    }

    const from = current === -1 ? 0 : current
    let next = from

    switch (e.key) {
      case "ArrowRight": next = Math.min(items.length - 1, from + 1); break
      case "ArrowLeft": next = Math.max(0, from - 1); break
      case "ArrowDown": next = this._verticalTarget(items, from, 1); break
      case "ArrowUp": next = this._verticalTarget(items, from, -1); break
      case "Home": next = 0; break
      case "End": next = items.length - 1; break
      default: return
    }

    e.preventDefault()
    items[next].focus()
  }

  // Vertical movement cannot be `index +/- columns`. Chapter headers span the
  // full grid row, so a chapter whose slide count isn't a multiple of the column
  // count leaves a short row, and the arithmetic walks past the start of the
  // next one — from the first tile of a 4-wide row in a 5-wide grid it skipped
  // to the second tile of the row below. Move geometrically instead: go to the
  // tile in the adjacent row whose horizontal centre is nearest this one, which
  // also does the right thing for the ragged last row and for collapsed
  // chapters (whose tiles are filtered out of `items` entirely).
  _verticalTarget(items, from, direction) {
    const box = (el) => el.getBoundingClientRect()
    const origin = box(items[from])
    const originCentre = origin.left + origin.width / 2
    const centreOf = (el) => box(el).left + box(el).width / 2

    // Rows share a top edge; allow a couple of pixels of rounding slack.
    const beyond = items.filter(el => direction > 0
      ? box(el).top > origin.top + 2
      : box(el).top < origin.top - 2)
    if (!beyond.length) return from

    const tops = beyond.map(el => box(el).top)
    const rowTop = direction > 0 ? Math.min(...tops) : Math.max(...tops)
    const row = beyond.filter(el => Math.abs(box(el).top - rowTop) <= 2)

    let nearest = row[0]
    for (const el of row) {
      if (Math.abs(centreOf(el) - originCentre) < Math.abs(centreOf(nearest) - originCentre)) nearest = el
    }
    return items.indexOf(nearest)
  }

  // ---- drag-reorder ---------------------------------------------------------

  dragStart(e) {
    const tile = e.currentTarget
    this._dragFromPos = Number(tile.dataset.position)
    tile.classList.add("is-dragging")
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", String(this._dragFromPos))
  }

  dragOver(e) {
    if (this._dragFromPos == null) return
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    this.tileTargets.forEach(t => t.classList.remove("is-drop-target"))
    e.currentTarget.classList.add("is-drop-target")
  }

  drop(e) {
    e.preventDefault()
    // A section drag only means something when dropped on another section
    // header; dropping it on a slide is a miss, not a slide reorder.
    if (this._dragChapterSlug) return this._clearDragState()

    const toTile = e.currentTarget
    const toPos = Number(toTile.dataset.position)
    const fromPos = this._dragFromPos
    // Read the source position before clearing, then clear unconditionally so a
    // no-op or failed drop can't leave highlights behind.
    this._clearDragState()
    if (!fromPos || !toPos || fromPos === toPos) return

    const total = this.tileTargets.length
    const order = []
    for (let i = 1; i <= total; i++) order.push(i)
    order.splice(fromPos - 1, 1)
    // If dragging downward, account for the removal shifting indexes.
    const insertAt = fromPos < toPos ? toPos - 1 : toPos - 1
    order.splice(insertAt, 0, fromPos)
    this._submitReorder(order)
  }

  dragEnd() {
    this._clearDragState()
  }

  // ---- reordering without drag ----------------------------------------------
  // HTML5 drag events are never produced by touch in iOS Safari, so on a tablet
  // the drag gestures below are dead and these buttons are the ONLY way to
  // reorder anything.

  moveSlide(e) {
    e.stopPropagation()
    const from = Number(e.currentTarget.dataset.position)
    const to = from + Number(e.currentTarget.dataset.delta)
    const total = this.tileTargets.length
    if (!from || to < 1 || to > total) return

    // Same splice-out-then-insert the drop handler uses, so a nudge and a drag
    // of one position produce an identical request.
    const order = Array.from({ length: total }, (_, i) => i + 1)
    order.splice(from - 1, 1)
    order.splice(to - 1, 0, from)
    this._submitReorder(order)
  }

  moveChapter(e) {
    e.stopPropagation()
    const slug = e.currentTarget.dataset.chapterSlug
    const delta = Number(e.currentTarget.dataset.delta)
    const blocks = this._chapterBlocks()
    const from = blocks.findIndex(b => b.slug === slug)
    const to = from + delta
    if (from === -1) return

    // Chapters move only within their own part — crossing into the next one
    // would carry the chapter's part along and split that part in two. And a
    // part's leading unnamed run has to stay first in it: its slides have no
    // chapter marker, so anything above them would swallow them.
    const part = blocks[from].part
    const first = blocks.findIndex(b => b.part === part)
    const floor = blocks[first].slug === "" ? first + 1 : first
    if (to < floor || to >= blocks.length || blocks[to].part !== part) return

    const reordered = [...blocks]
    ;[reordered[from], reordered[to]] = [reordered[to], reordered[from]]
    this._submitReorder(reordered.flatMap(b => b.positions))
  }

  // ---- chapters: reorder whole sections -------------------------------------

  chapterDragStart(e) {
    const header = e.currentTarget
    this._dragChapterSlug = header.dataset.chapterSlug
    this._dragChapterPart = header.dataset.partSlug
    header.classList.add("is-dragging")
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", this._dragChapterSlug)
  }

  chapterDragOver(e) {
    if (!this._dragChapterSlug) return
    if (e.currentTarget.dataset.chapterSlug === this._dragChapterSlug) return
    // Same rule as moveChapter: a chapter stays inside its own part.
    if (e.currentTarget.dataset.partSlug !== this._dragChapterPart) return

    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    this.chapterHeaderTargets.forEach(h => h.classList.remove("is-drop-target"))
    e.currentTarget.classList.add("is-drop-target")
  }

  chapterDrop(e) {
    e.preventDefault()
    const from = this._dragChapterSlug
    const to = e.currentTarget.dataset.chapterSlug
    this._clearDragState()
    if (!from || !to || from === to) return

    const order = this._orderMovingChapter(from, to)
    if (order) this._submitReorder(order)
  }

  // Slide order that relocates a whole chapter. Mirrors the tile drop rule so
  // both gestures feel the same: dragging downward lands after the target,
  // dragging upward lands before it. Reordering by whole blocks also means the
  // server sees a multi-slide move, so its per-slide chapter preservation
  // carries every marker along untouched.
  _orderMovingChapter(fromSlug, toSlug) {
    const blocks = this._chapterBlocks()
    const from = blocks.findIndex(b => b.slug === fromSlug)
    const to = blocks.findIndex(b => b.slug === toSlug)
    if (from === -1 || to === -1 || blocks[from].part !== blocks[to].part) return null

    const [moved] = blocks.splice(from, 1)
    blocks.splice(to, 0, moved)
    return blocks.flatMap(b => b.positions)
  }

  // Contiguous runs of slide positions in document order, one per chapter plus
  // each part's leading unnamed run, tagged with the part they sit in. Built
  // from every tile including hidden ones, since a collapsed chapter still has
  // to appear in the reordered list.
  _chapterBlocks() {
    const blocks = []

    this.tileTargets.forEach(tile => {
      const slug = tile.dataset.chapterSlug || ""
      const part = tile.dataset.partSlug || ""
      const last = blocks[blocks.length - 1]
      if (!last || last.slug !== slug || last.part !== part) blocks.push({ slug, part, positions: [] })
      blocks[blocks.length - 1].positions.push(Number(tile.dataset.position))
    })

    return blocks
  }

  async _submitReorder(order) {
    try {
      const res = await fetch(this.reorderUrlValue, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Accept": "application/json", "X-CSRF-Token": csrfToken() },
        body: JSON.stringify({ order }),
      })
      if (!res.ok) throw new Error(`reorder HTTP ${res.status}`)
      window.location.reload()
    } catch (err) {
      console.warn("reorder failed:", err)
      alert("Reorder failed — see console.")
    }
  }

  // ---- create / delete ------------------------------------------------------

  async addSlide() {
    try {
      const res = await fetch(this.createUrlValue, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "text/html", "X-CSRF-Token": csrfToken() },
        body: JSON.stringify({}),
        redirect: "follow",
      })
      if (!res.ok && res.status !== 200 && res.status !== 303) throw new Error(`create HTTP ${res.status}`)
      // Server redirects to edit URL; just follow.
      window.location = res.url
    } catch (err) {
      console.warn("create failed:", err)
      alert("Create failed — see console.")
    }
  }

  async deleteSlide(e) {
    e.stopPropagation()
    const pos = e.currentTarget.dataset.position
    if (!confirm(`Delete slide ${pos}?`)) return
    try {
      const res = await fetch(`/presentations/${this.slugValue}/slides/${pos}`, {
        method: "DELETE",
        headers: { "Accept": "application/json", "X-CSRF-Token": csrfToken() },
      })
      if (!res.ok) throw new Error(`delete HTTP ${res.status}`)
      window.location.reload()
    } catch (err) {
      console.warn("delete failed:", err)
      alert("Delete failed — see console.")
    }
  }
}

function csrfToken() {
  return document.querySelector('meta[name="csrf-token"]')?.content || ""
}
