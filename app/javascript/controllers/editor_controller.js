import { Controller } from "@hotwired/stimulus"

// Drives the per-slide editor: debounced live preview + auto-save,
// attribute toggles, and Cmd/Ctrl+S immediate save.
export default class extends Controller {
  static targets = ["textarea", "preview", "previewSlide", "status", "labelInput", "chapterInput"]
  static values = {
    previewUrl: String,
    saveUrl:    String,
    doneUrl:    String,
    csrf:       String,
    etag:       String,
  }

  PREVIEW_DEBOUNCE_MS = 200
  SAVE_DEBOUNCE_MS    = 800

  connect() {
    this._previewTimer = null
    this._saveTimer    = null
    this._previewInflight = false
    this._previewDirty    = false
    this._saveInflight    = false
    this._saveDirty       = false
    this._currentEtag     = this.etagValue

    document.addEventListener("keydown", this._onKey = (e) => this._handleKey(e))
  }

  disconnect() {
    document.removeEventListener("keydown", this._onKey)
  }

  // Called on textarea input AND from synthetic events after attribute toggles.
  onInput() {
    this._setStatus("Editing…", "dirty")
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
    this._save()
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
