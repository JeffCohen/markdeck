import { Controller } from "@hotwired/stimulus"

// Deck settings modal: theme/mode/colors/fonts, writes straight to config.yml.
export default class extends Controller {
  static targets = ["root", "theme", "mode", "color", "font", "status", "previewFrame"]
  static values  = { updateUrl: String, defaultColors: Object }

  connect() {
    document.addEventListener("keydown", this._onKey = (e) => this._handleKey(e))
    window.addEventListener("resize", this._onResize = () => this._scalePreview())
    this.syncPreview()
  }

  disconnect() {
    document.removeEventListener("keydown", this._onKey)
    window.removeEventListener("resize", this._onResize)
  }

  _handleKey(e) {
    if (e.key === "Escape" && this._isOpen()) {
      e.preventDefault()
      this.close()
    }
  }

  _isOpen() { return !this.rootTarget.classList.contains("hidden") }

  open()  {
    this.rootTarget.classList.remove("hidden")
    // The preview was hidden (display:none) until now, so it had no
    // measurable width — (re)scale it now that it's actually visible.
    this.syncPreview()
    this._scalePreview()
  }
  close() { this.rootTarget.classList.add("hidden") }

  backdropClick() { this.close() }
  stopPropagation(e) { e.stopPropagation() }

  // Switching Dark/Light previously left the color swatches showing the old
  // mode's values, which then got saved right back on top of the new mode's
  // defaults — so the mode switch had no visible effect. Reset the swatches
  // to the new mode's defaults; still fully editable before Save.
  modeChanged(e) {
    const defaults = this.defaultColorsValue[e.target.value]
    if (defaults) this.colorTargets.forEach(t => { t.value = defaults[t.dataset.key] })
    this.syncPreview()
  }

  // Live-updates the sample-slide thumbnail in the modal to reflect whatever
  // is currently selected/typed in the form — even before Save — so you can
  // see a theme/color/font change without committing to it first.
  syncPreview() {
    if (!this.hasPreviewFrameTarget) return
    const theme = this.themeTargets.find(t => t.checked)?.value
    const mode  = this.modeTargets.find(t => t.checked)?.value
    const el = this.previewFrameTarget

    el.className = `thumb-preview theme-${theme} mode-${mode}`
    this.colorTargets.forEach(t => el.style.setProperty(`--md-${t.dataset.key}`, t.value))
    this.fontTargets.forEach(t => el.style.setProperty(`--md-font-${t.dataset.key}`, t.value))
  }

  // Same fixed-1280x720-scaled-to-fit trick used by the editor preview and
  // overview thumbnails.
  _scalePreview() {
    if (!this.hasPreviewFrameTarget) return
    const content = this.previewFrameTarget.querySelector(".thumb-content")
    const w = this.previewFrameTarget.clientWidth
    if (content && w > 0) content.style.transform = `scale(${w / 1280})`
  }

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
