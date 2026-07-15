import { Controller } from "@hotwired/stimulus"

// Overview in edit mode: drag-to-reorder, +Add tile, per-tile delete.
// Opens with the "O" key (when not in a text input).
export default class extends Controller {
  static targets = ["root", "tile"]
  static values  = {
    slug:       String,
    createUrl:  String,
    reorderUrl: String,
  }

  connect() {
    this._dragFromPos = null
    document.addEventListener("keydown", this._onKey = (e) => this._handleKey(e))
  }

  disconnect() {
    document.removeEventListener("keydown", this._onKey)
  }

  _handleKey(e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return
    const t = e.target
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return
    if (e.key === "o" || e.key === "O") {
      e.preventDefault()
      this.toggle()
    } else if (e.key === "Escape" && this._isOpen()) {
      e.preventDefault()
      this.close()
    }
  }

  _isOpen() { return !this.rootTarget.classList.contains("hidden") }

  toggle() { this._isOpen() ? this.close() : this.open() }

  open()  { this.rootTarget.classList.remove("hidden") }
  close() { this.rootTarget.classList.add("hidden") }

  backdropClick() { this.close() }
  stopPropagation(e) { e.stopPropagation() }

  // Tile click on the in-editor Overview MODAL → jump to that slide's editor.
  openSlide(e) {
    if (e.target.closest(".overview-edit__delete, .overview-edit__edit-pill")) return
    const pos = e.currentTarget.dataset.position
    window.location = `/presentations/${this.slugValue}/slides/${pos}/edit`
  }

  // Tile click on the Overview LANDING PAGE → enter present mode at that slide.
  presentSlide(e) {
    if (e.target.closest(".overview-edit__delete, .overview-edit__edit-pill")) return
    const pos = e.currentTarget.dataset.position
    window.location = `/presentations/${this.slugValue}/slides/${pos}`
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
