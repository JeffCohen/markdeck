import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["link"]

  connect() {
    this.keyHandler = this.handleKey.bind(this)
    window.addEventListener("keydown", this.keyHandler)
  }

  disconnect() {
    window.removeEventListener("keydown", this.keyHandler)
  }

  handleKey(event) {
    if (event.metaKey || event.ctrlKey || event.altKey) return
    const tag = (event.target.tagName || "").toUpperCase()
    if (tag === "INPUT" || tag === "TEXTAREA") return
    if (!this.linkTargets.length) return

    const focusedIdx = this.linkTargets.indexOf(document.activeElement)

    if (focusedIdx === -1) {
      if (["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"].includes(event.key)) {
        this.linkTargets[0].focus()
        event.preventDefault()
      }
      return
    }

    const cols = this.columns()
    let next = focusedIdx
    const last = this.linkTargets.length - 1

    switch (event.key) {
      case "ArrowRight": next = Math.min(last, focusedIdx + 1); break
      case "ArrowLeft":  next = Math.max(0, focusedIdx - 1); break
      case "ArrowDown":  next = Math.min(last, focusedIdx + cols); break
      case "ArrowUp":    next = Math.max(0, focusedIdx - cols); break
      case "Home":       next = 0; break
      case "End":        next = last; break
      default: return
    }

    event.preventDefault()
    this.linkTargets[next].focus()
  }

  columns() {
    if (this.linkTargets.length < 2) return 1
    const firstTop = this.linkTargets[0].getBoundingClientRect().top
    for (let i = 1; i < this.linkTargets.length; i++) {
      if (this.linkTargets[i].getBoundingClientRect().top !== firstTop) return i
    }
    return this.linkTargets.length
  }
}
