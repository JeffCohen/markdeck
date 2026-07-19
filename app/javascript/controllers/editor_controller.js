import { Controller } from "@hotwired/stimulus"

// Drives the per-slide editor: debounced live preview + auto-save,
// attribute toggles, and Cmd/Ctrl+S immediate save.
export default class extends Controller {
  static targets = ["textarea", "preview", "previewSlide", "status", "labelInput", "chapterInput"]
  static values = {
    previewUrl: String,
    saveUrl:    String,
    doneUrl:    String,
    createUrl:  String,
    position:   Number,
    csrf:       String,
    etag:       String,
  }

  PREVIEW_DEBOUNCE_MS = 200
  SAVE_DEBOUNCE_MS    = 800
  RELOAD_IDLE_MS      = 3000

  connect() {
    this._previewTimer = null
    this._saveTimer    = null
    this._reloadTimer  = null
    this._previewInflight = false
    this._previewDirty    = false
    this._saveInflight    = false
    this._saveDirty       = false
    this._currentEtag     = this.etagValue

    document.addEventListener("keydown", this._onKey = (e) => this._handleKey(e))
    window.addEventListener("resize", this._onResize = () => this._scalePreview())
    this._scalePreview()

    // Arriving here via the "E" shortcut (or any nav) should drop the
    // cursor straight into the markdown, not leave focus invisible on body.
    this.textareaTarget.focus()
    const end = this.textareaTarget.value.length
    this.textareaTarget.setSelectionRange(end, end)
  }

  disconnect() {
    document.removeEventListener("keydown", this._onKey)
    window.removeEventListener("resize", this._onResize)
    clearTimeout(this._reloadTimer)
  }

  // Called on textarea input AND from synthetic events after attribute toggles.
  onInput() {
    this._setStatus("Editing…", "dirty")
    clearTimeout(this._reloadTimer)
    this._schedulePreview()
    this._scheduleSave()
  }

  // ---- attribute toggles ----------------------------------------------------

  toggleCenter(e) {
    this._rewriteFrontMatter("center", e.target.checked ? true : null)
    this._fireInput()
  }

  setLabel(e) {
    this._rewriteFrontMatter("label", e.target.value)
    this._fireInput()
  }

  setChapter(e) {
    this._rewriteFrontMatter("chapter", e.target.value)
    this._fireInput()
  }

  // ---- live preview ---------------------------------------------------------

  _schedulePreview() {
    clearTimeout(this._previewTimer)
    this._previewTimer = setTimeout(() => this._fetchPreview(), this.PREVIEW_DEBOUNCE_MS)
  }

  async _fetchPreview() {
    if (this._previewInflight) { this._previewDirty = true; return }
    this._previewInflight = true

    const body = this.textareaTarget.value
    try {
      const res = await fetch(this.previewUrlValue, {
        method:  "POST",
        headers: {
          "Content-Type":   "application/json",
          "Accept":         "application/json",
          "X-CSRF-Token":   this.csrfValue,
        },
        body: JSON.stringify({ preview: { body } }),
      })
      if (!res.ok) throw new Error(`preview HTTP ${res.status}`)
      const data = await res.json()
      this.previewTarget.innerHTML = data.html
      this.previewSlideTarget.classList.toggle("slide--center", !!data.centered)
      this._runMermaid()
    } catch (err) {
      console.warn("preview failed:", err)
    } finally {
      this._previewInflight = false
      if (this._previewDirty) {
        this._previewDirty = false
        this._schedulePreview()
      }
    }
  }

  // The preview renders at a fixed virtual 1280x720 (matching the print/PDF
  // export size and the overview thumbnails) and gets scaled down to fit
  // the actual pane width — same trick as scaleThumbs() in deck_controller.
  _scalePreview() {
    if (!this.hasPreviewSlideTarget) return
    const VIRTUAL_WIDTH = 1280
    const wrap = this.previewSlideTarget.parentElement
    const w = wrap.clientWidth
    if (w > 0) this.previewSlideTarget.style.transform = `scale(${w / VIRTUAL_WIDTH})`
  }

  _runMermaid() {
    if (!window.mermaid) return
    const nodes = this.previewTarget.querySelectorAll("pre.mermaid:not([data-processed])")
    if (nodes.length > 0) {
      try { window.mermaid.run({ nodes }) } catch (e) { console.warn("mermaid failed:", e) }
    }
  }

  // ---- save -----------------------------------------------------------------

  _scheduleSave() {
    clearTimeout(this._saveTimer)
    this._saveTimer = setTimeout(() => this._save(), this.SAVE_DEBOUNCE_MS)
  }

  // Cmd/Ctrl+S → flush immediately
  flush() {
    clearTimeout(this._saveTimer)
    return this._save()
  }

  async _save() {
    if (this._saveInflight) { this._saveDirty = true; return }
    this._saveInflight = true

    const body = this.textareaTarget.value
    try {
      const res = await fetch(this.saveUrlValue, {
        method:  "PATCH",
        headers: {
          "Content-Type":   "application/json",
          "Accept":         "application/json",
          "X-CSRF-Token":   this.csrfValue,
        },
        body: JSON.stringify({ slide: { body, etag: this._currentEtag } }),
      })
      if (res.status === 409) {
        const data = await res.json().catch(() => ({}))
        this._setStatus("File changed on disk — reload to keep editing", "error")
        this._currentEtag = data.current_etag || this._currentEtag
        return
      }
      if (!res.ok) throw new Error(`save HTTP ${res.status}`)
      const data = await res.json()
      this._currentEtag = data.etag
      const now = new Date()
      this._setStatus(`Saved · ${now.toLocaleTimeString()}`, "ok")
      this._scheduleReload()
    } catch (err) {
      console.warn("save failed:", err)
      this._setStatus("Save failed — will retry", "error")
    } finally {
      this._saveInflight = false
      if (this._saveDirty) {
        this._saveDirty = false
        this._scheduleSave()
      }
    }
  }

  // Reload the page RELOAD_IDLE_MS after a save, so newly-added CSS (e.g. a
  // Tailwind class typed into slide markdown) shows up without an explicit
  // Esc-to-overview round trip. Cancelled by onInput so it never yanks the
  // textarea out from under an actively-typing user.
  _scheduleReload() {
    clearTimeout(this._reloadTimer)
    this._reloadTimer = setTimeout(() => window.location.reload(), this.RELOAD_IDLE_MS)
  }

  // ---- new slide / duplicate -------------------------------------------------

  // Save this slide, insert a blank slide right after it, and jump into editing that.
  async newSlideAfter() {
    await this.flush()
    await this._createSlide({ after: this.positionValue })
  }

  // Save this slide, insert a copy of it right after, and jump into editing the copy.
  async duplicateSlide() {
    const body = this.textareaTarget.value
    await this.flush()
    await this._createSlide({ after: this.positionValue, body })
  }

  async _createSlide(payload) {
    if (!this.hasCreateUrlValue) return
    try {
      const res = await fetch(this.createUrlValue, {
        method:  "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept":       "text/html",
          "X-CSRF-Token": this.csrfValue,
        },
        body: JSON.stringify(payload),
        redirect: "follow",
      })
      if (!res.ok && res.status !== 200 && res.status !== 303) throw new Error(`create HTTP ${res.status}`)
      window.location = res.url
    } catch (err) {
      console.warn("create failed:", err)
      alert("Create failed — see console.")
    }
  }

  // ---- helpers --------------------------------------------------------------

  _setStatus(text, state) {
    if (!this.hasStatusTarget) return
    this.statusTarget.textContent = text
    this.statusTarget.dataset.state = state
  }

  _fireInput() {
    this.textareaTarget.dispatchEvent(new Event("input", { bubbles: true }))
  }

  _handleKey(e) {
    // Cmd/Ctrl+S anywhere → flush save
    if ((e.metaKey || e.ctrlKey) && (e.key === "s" || e.key === "S")) {
      e.preventDefault()
      this.flush()
      return
    }

    // Cmd/Ctrl+Enter → save & create the next slide, then edit it
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault()
      this.newSlideAfter()
      return
    }

    // Cmd/Ctrl+D → duplicate this slide, then edit the copy
    if ((e.metaKey || e.ctrlKey) && (e.key === "d" || e.key === "D")) {
      e.preventDefault()
      this.duplicateSlide()
      return
    }

    // Esc → Done (return to present mode at current slide).
    // Skip when the palette is open — let palette handle its own Esc to close.
    if (e.key === "Escape" && this.hasDoneUrlValue) {
      const paletteOpen = document.querySelector(".palette:not(.hidden)")
      if (paletteOpen) return
      e.preventDefault()
      this.flush()  // best-effort save before navigation
      window.location = this.doneUrlValue
    }
  }

  // ---- front-matter rewriting ----------------------------------------------

  // Port of Slide.with_front_matter — keeps the textarea as the source of truth.
  _rewriteFrontMatter(key, value) {
    const body = this.textareaTarget.value
    const fm = this._parseFrontMatter(body) || {}

    if (value === null || value === false || value === "") {
      delete fm[key]
    } else {
      fm[key] = value
    }

    let rest = body.replace(FRONT_MATTER_RE, "")
    if (key === "center") {
      rest = rest.replace(CENTER_COMMENT_RE, "")
    }

    const newBody = Object.keys(fm).length === 0
      ? rest
      : this._emitFrontMatter(fm) + rest

    // Preserve cursor position relative to the body portion.
    const ta = this.textareaTarget
    const oldFmLen = (body.match(FRONT_MATTER_RE)?.[0] || "").length
    const newFmLen = newBody.length - rest.length
    const delta = newFmLen - oldFmLen
    const start = ta.selectionStart
    const end   = ta.selectionEnd
    ta.value = newBody
    // Only shift the cursor if it was after the front-matter block.
    if (start >= oldFmLen) {
      ta.setSelectionRange(start + delta, end + delta)
    }
  }

  _parseFrontMatter(body) {
    const m = body.match(FRONT_MATTER_RE)
    if (!m) return null
    const out = {}
    for (const line of m[1].split("\n")) {
      const kv = line.match(/^\s*([a-z_]+)\s*:\s*(.*?)\s*$/i)
      if (!kv) continue
      const [, k, rawV] = kv
      if (!ALLOWED_KEYS.includes(k)) continue
      out[k] = parseScalar(rawV)
    }
    return out
  }

  _emitFrontMatter(fm) {
    const lines = Object.entries(fm).map(([k, v]) => `${k}: ${formatScalar(v)}`)
    return `---\n${lines.join("\n")}\n---\n`
  }
}

const ALLOWED_KEYS = ["center", "label", "chapter"]
const FRONT_MATTER_RE  = /^---\s*\n([\s\S]*?)\n---\s*\n?/
const CENTER_COMMENT_RE = /<!--\s*center\s*-->/g

function parseScalar(s) {
  if (s === "true")  return true
  if (s === "false") return false
  // strip surrounding quotes if any
  const m = s.match(/^['"](.*)['"]$/)
  return m ? m[1] : s
}

function formatScalar(v) {
  if (v === true || v === false) return String(v)
  // Quote only if necessary (contains YAML-special chars).
  if (/[:#&*!|>'"%@`,\[\]{}]/.test(v) || /^\s|\s$/.test(v)) {
    return JSON.stringify(v)
  }
  return v
}
