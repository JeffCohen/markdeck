import { Controller } from "@hotwired/stimulus"

// Deck landing page grid: drag-to-reorder, +Add tile, per-tile delete.
export default class extends Controller {
  static targets = ["tile", "add", "chapterHeader"]
  static values  = {
    slug:       String,
    createUrl:  String,
    reorderUrl: String,
  }

  connect() {
    this._dragFromPos = null
    this._applyCollapsed()
    const items = this._items()
    if (items.length) items[0].focus()

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

  disconnect() {
    window.removeEventListener("resize", this._onResize)
    window.removeEventListener("dragend", this._onDragFinish)
    window.removeEventListener("drop", this._onDragFinish)
  }

  _clearDragState() {
    this.tileTargets.forEach(t => t.classList.remove("is-dragging", "is-drop-target"))
    this._dragFromPos = null
  }

  // Slide tiles plus the trailing "+ new slide" tile, in grid order. Tiles
  // inside a collapsed chapter are excluded: arrow keys shouldn't move focus to
  // something invisible, and _columns() measures offsetTop, which is 0 for a
  // display:none tile and would otherwise wreck the row arithmetic.
  _items() {
    const tiles = this.tileTargets.filter(t => t.offsetParent !== null)
    return this.hasAddTarget ? [...tiles, this.addTarget] : tiles
  }

  // ---- chapters: collapse ---------------------------------------------------

  // Collapsed chapters live in localStorage per deck — there's no database, and
  // this is view state that shouldn't touch the slide files.
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

  toggleChapter(e) {
    e.stopPropagation()
    const slug = e.currentTarget.dataset.chapterSlug
    const collapsed = this._collapsed()
    collapsed.has(slug) ? collapsed.delete(slug) : collapsed.add(slug)
    this._saveCollapsed(collapsed)
    this._applyCollapsed()
    // Tiles that just became visible had no layout box, so never got scaled.
    this._scaleThumbs()
  }

  _applyCollapsed() {
    const collapsed = this._collapsed()

    this.tileTargets.forEach(tile => {
      const slug = tile.dataset.chapterSlug
      tile.classList.toggle("is-collapsed", !!slug && collapsed.has(slug))
    })

    this.chapterHeaderTargets.forEach(header => {
      const isCollapsed = collapsed.has(header.dataset.chapterSlug)
      header.classList.toggle("is-collapsed", isCollapsed)
      const toggle = header.querySelector(".overview-chapter__toggle")
      if (toggle) {
        toggle.setAttribute("aria-expanded", String(!isCollapsed))
        toggle.textContent = isCollapsed ? "▸" : "▾"
      }
    })
  }

  // ---- chapters: markers ----------------------------------------------------

  startChapter(e) {
    e.stopPropagation()
    this._editChapterName(e.currentTarget, "")
  }

  renameChapter(e) {
    e.stopPropagation()
    this._editChapterName(e.currentTarget.closest(".overview-edit__chapter"), e.currentTarget.textContent.trim())
  }

  // Swap the control for a text input rather than using prompt(), which blocks
  // the page and looks nothing like the rest of the UI. Enter commits, Escape
  // or blurring without a change puts the original control back.
  _editChapterName(control, current) {
    const position = control.dataset.position || control.querySelector("[data-position]")?.dataset.position
    const input = document.createElement("input")
    input.type = "text"
    input.className = "overview-edit__chapter-input"
    input.value = current
    input.placeholder = "Chapter name"
    input.setAttribute("aria-label", "Chapter name")

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
      this._writeChapter(position, name)
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

  async clearChapter(e) {
    e.stopPropagation()
    await this._writeChapter(e.currentTarget.dataset.position, null)
  }

  // PATCH with a name opens a chapter at that slide; DELETE removes the marker.
  // Either way the grouping is derived from the files, so reload to re-render.
  async _writeChapter(position, name) {
    const url = `/presentations/${encodeURIComponent(this.slugValue)}/slides/${position}/chapter`
    try {
      const res = await fetch(url, {
        method: name === null ? "DELETE" : "PATCH",
        headers: { "Content-Type": "application/json", "Accept": "application/json", "X-CSRF-Token": csrfToken() },
        body: name === null ? undefined : JSON.stringify({ chapter: { name } }),
      })
      if (!res.ok) throw new Error(`chapter HTTP ${res.status}`)
      window.location.reload()
    } catch (err) {
      console.warn("chapter update failed:", err)
      alert("Could not update the chapter — see console.")
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

    const cols = this._columns(items)
    const from = current === -1 ? 0 : current
    let next = from

    switch (e.key) {
      case "ArrowRight": next = Math.min(items.length - 1, from + 1); break
      case "ArrowLeft": next = Math.max(0, from - 1); break
      case "ArrowDown": next = Math.min(items.length - 1, from + cols); break
      case "ArrowUp": next = Math.max(0, from - cols); break
      case "Home": next = 0; break
      case "End": next = items.length - 1; break
      default: return
    }

    e.preventDefault()
    items[next].focus()
  }

  _columns(items) {
    if (items.length < 2) return 1
    const firstTop = items[0].offsetTop
    const nextRow = items.findIndex(t => t.offsetTop !== firstTop)
    return nextRow === -1 ? items.length : nextRow
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
