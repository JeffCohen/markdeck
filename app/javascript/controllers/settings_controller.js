import { Controller } from "@hotwired/stimulus"

// Deck settings modal: theme/mode/colors/fonts, writes straight to config.yml.
export default class extends Controller {
  static targets = ["root", "theme", "mode", "color", "font", "status"]
  static values  = { updateUrl: String }

  connect() {
    document.addEventListener("keydown", this._onKey = (e) => this._handleKey(e))
  }

  disconnect() {
    document.removeEventListener("keydown", this._onKey)
  }

  _handleKey(e) {
    if (e.key === "Escape" && this._isOpen()) {
      e.preventDefault()
      this.close()
    }
  }

  _isOpen() { return !this.rootTarget.classList.contains("hidden") }

  open()  { this.rootTarget.classList.remove("hidden") }
  close() { this.rootTarget.classList.add("hidden") }

  backdropClick() { this.close() }
  stopPropagation(e) { e.stopPropagation() }

  async save() {
    const theme = this.themeTargets.find(t => t.checked)?.value
    const mode  = this.modeTargets.find(t => t.checked)?.value
    const colors = {}
    this.colorTargets.forEach(t => { colors[t.dataset.key] = t.value })
    const fonts = {}
    this.fontTargets.forEach(t => { fonts[t.dataset.key] = t.value })

    this._setStatus("Saving…")
    try {
      const res = await fetch(this.updateUrlValue, {
        method:  "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept":       "application/json",
          "X-CSRF-Token": csrfToken(),
        },
        body: JSON.stringify({ settings: { theme, mode, colors, fonts } }),
      })
      if (!res.ok) throw new Error(`settings HTTP ${res.status}`)
      window.location.reload()
    } catch (err) {
      console.warn("settings save failed:", err)
      this._setStatus("Save failed — see console")
    }
  }

  _setStatus(text) {
    if (this.hasStatusTarget) this.statusTarget.textContent = text
  }
}

function csrfToken() {
  return document.querySelector('meta[name="csrf-token"]')?.content || ""
}
