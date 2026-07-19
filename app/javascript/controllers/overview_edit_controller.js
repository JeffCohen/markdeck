import { Controller } from "@hotwired/stimulus"

// Deck landing page grid: drag-to-reorder, +Add tile, per-tile delete.
export default class extends Controller {
  static targets = ["tile", "add"]
  static values  = {
    slug:       String,
    createUrl:  String,
    reorderUrl: String,
  }

  connect() {
    this._dragFromPos = null
    const items = this._items()
    if (items.length) items[0].focus()
  }

  // Slide tiles plus the trailing "+ new slide" tile, in grid order.
  _items() {
    return this.hasAddTarget ? [...this.tileTargets, this.addTarget] : this.tileTargets
  }

  stopPropagation(e) { e.stopPropagation() }

  // Tile click → enter present mode at that slide.
  presentSlide(e) {
    if (e.target.closest(".overview-edit__delete, .overview-edit__edit-pill")) return
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
    toTile.classList.remove("is-drop-target")
    const toPos = Number(toTile.dataset.position)
    const fromPos = this._dragFromPos
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
    this.tileTargets.forEach(t => {
      t.classList.remove("is-dragging")
      t.classList.remove("is-drop-target")
    })
    this._dragFromPos = null
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
