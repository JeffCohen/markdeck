import { Controller } from "@hotwired/stimulus"

// The virtual slide canvas every surface renders into: present mode, the editor
// preview, the overview thumbs, and each PDF page.
const SLIDE_WIDTH = 1280
const SLIDE_HEIGHT = 720

export default class extends Controller {
  static targets = ["slide", "counter", "total", "help", "progress", "notesDot", "overviewLink"]
  static values = {
    count: Number, index: Number, slug: String, start: Number,
    // 1-based, inclusive. Set only when presenting a single chapter; navigation
    // is then clamped to this span while slide positions stay deck-global.
    rangeStart: Number, rangeEnd: Number,
  }

  // Inclusive 0-based bounds of what's navigable.
  get lowIndex() {
    return this.hasRangeStartValue && this.rangeStartValue > 0 ? this.rangeStartValue - 1 : 0
  }

  get highIndex() {
    return this.hasRangeEndValue && this.rangeEndValue > 0
      ? Math.min(this.rangeEndValue - 1, this.countValue - 1)
      : this.countValue - 1
  }

  get rangeLength() {
    return this.highIndex - this.lowIndex + 1
  }

  connect() {
    const hashed = this.readHash()
    this.indexValue = window.location.hash ? hashed : (this.hasStartValue ? this.startValue : hashed)
    this.show(this.indexValue)
    this.keyHandler = this.handleKey.bind(this)
    this.hashHandler = () => {
      const idx = this.readHash()
      if (idx !== this.indexValue) this.show(idx)
    }
    this.resizeHandler = () => {
      this.scaleSlides()
      if (document.body.classList.contains("peek-preview")) this.scaleThumbs()
    }
    window.addEventListener("keydown", this.keyHandler)
    window.addEventListener("hashchange", this.hashHandler)
    window.addEventListener("resize", this.resizeHandler)
  }

  disconnect() {
    window.removeEventListener("keydown", this.keyHandler)
    window.removeEventListener("hashchange", this.hashHandler)
    window.removeEventListener("resize", this.resizeHandler)
  }

  readHash() {
    const m = window.location.hash.match(/^#(\d+)$/)
    if (!m) return 0
    return this.clamp(parseInt(m[1], 10) - 1)
  }

  clamp(i) {
    if (!Number.isFinite(i)) return this.lowIndex
    return Math.max(this.lowIndex, Math.min(this.highIndex, i))
  }

  show(idx) {
    idx = this.clamp(idx)
    if (idx !== this.indexValue) {
      document.body.classList.remove("peek-notes", "peek-preview")
    }
    this.indexValue = idx
    this.slideTargets.forEach((el, i) => {
      el.classList.toggle("is-current", i === idx)
      el.setAttribute("aria-hidden", i === idx ? "false" : "true")
    })
    // The slide that just became current has a layout box for the first time.
    this.scaleSlides()
    // Counter and progress read relative to the range, so a chapter shows
    // "3 / 6" rather than the slide's position in the whole deck.
    if (this.hasCounterTarget) this.counterTarget.textContent = String(idx - this.lowIndex + 1)
    if (this.hasTotalTarget) this.totalTarget.textContent = String(this.rangeLength)
    if (this.hasProgressTarget && this.rangeLength > 0) {
      const r = parseFloat(this.progressTarget.getAttribute("r")) || 18
      const circumference = 2 * Math.PI * r
      const pct = this.rangeLength === 1 ? 1 : (idx - this.lowIndex) / (this.rangeLength - 1)
      this.progressTarget.style.strokeDashoffset = String(circumference * (1 - pct))
    }
    const newHash = `#${idx + 1}`
    if (window.location.hash !== newHash) {
      history.replaceState(null, "", newHash)
    }
    // Keep the "← overview" link pointing at the slide on screen, so clicking it
    // lands on the same tile the O shortcut would.
    if (this.hasOverviewLinkTarget) this.overviewLinkTarget.hash = newHash
    if (document.body.classList.contains("peek-preview")) {
      requestAnimationFrame(() => this.scaleThumbs())
    }

    const current = this.slideTargets[idx]
    if (this.hasNotesDotTarget) {
      const hasNotes = !!(current && current.querySelector(".speaker-peek--notes"))
      this.notesDotTarget.classList.toggle("hidden", !hasNotes)
    }
    if (current && window.mermaid) {
      const pending = current.querySelectorAll("pre.mermaid:not([data-processed])")
      if (pending.length) {
        window.mermaid.run({ nodes: pending }).catch(() => {})
      }
    }
  }

  next() { this.show(this.indexValue + 1) }
  prev() { this.show(this.indexValue - 1) }
  first() { this.show(this.lowIndex) }
  last() { this.show(this.highIndex) }

  // Hand the overview the slide being viewed via the same #N convention the deck
  // already uses for its own position, so it can open on that tile.
  goToOverview() {
    if (!this.hasSlugValue) return
    window.location = `/presentations/${this.slugValue}#${this.indexValue + 1}`
  }

  // Fit the current slide's 1280x720 canvas into the viewport, letterboxing on
  // whichever axis binds. Called synchronously from show() (before paint, so
  // there's no flash of an unscaled canvas) and on every resize — a hidden
  // slide has no layout box, so only .is-current can be measured.
  scaleSlides() {
    this.element.querySelectorAll(".slide.is-current .slide-stage").forEach(stage => {
      const box = stage.parentElement
      const w = box.clientWidth
      const h = box.clientHeight
      if (w > 0 && h > 0) {
        const scale = Math.min(w / SLIDE_WIDTH, h / SLIDE_HEIGHT)
        stage.style.setProperty("--slide-scale", String(scale))
      }
    })
  }

  // Scoped to the peek: the deck's own canvas is scaled by scaleSlides(), and
  // an inline transform here would fight it.
  scaleThumbs() {
    this.element.querySelectorAll(".speaker-peek--preview .thumb-content").forEach(content => {
      const wrap = content.parentElement
      const w = wrap.clientWidth
      if (w > 0) {
        content.style.transform = `scale(${w / SLIDE_WIDTH})`
      }
    })
  }

  togglePeek(kind) {
    const own = `peek-${kind}`
    const other = kind === "notes" ? "peek-preview" : "peek-notes"
    document.body.classList.remove(other)
    document.body.classList.toggle(own)
    if (document.body.classList.contains(own)) {
      requestAnimationFrame(() => this.scaleThumbs())
    }
  }

  toggleHelp(forceClose) {
    if (!this.hasHelpTarget) return
    const isHidden = this.helpTarget.classList.contains("hidden")
    if (forceClose === true || !isHidden) {
      this.helpTarget.classList.add("hidden")
    } else {
      this.helpTarget.classList.remove("hidden")
    }
  }

  handleKey(event) {
    if (event.metaKey || event.ctrlKey || event.altKey) return
    const tag = (event.target.tagName || "").toUpperCase()
    if (tag === "INPUT" || tag === "TEXTAREA") return

    switch (event.key) {
      case "ArrowRight":
      case " ":
      case "PageDown":
      case "j":
        this.next(); event.preventDefault(); break
      case "ArrowLeft":
      case "Backspace":
      case "PageUp":
      case "k":
        this.prev(); event.preventDefault(); break
      case "Home":
      case "f":
      case "F":
        this.first(); event.preventDefault(); break
      case "End":
      case "l":
      case "L":
        this.last(); event.preventDefault(); break
      case "o":
      case "O":
        this.goToOverview(); event.preventDefault(); break
      case "p":
      case "P":
        this.togglePeek("preview"); event.preventDefault(); break
      case "n":
      case "N":
        this.togglePeek("notes"); event.preventDefault(); break
      case "?":
        this.toggleHelp(); event.preventDefault(); break
      case "e":
      case "E":
        this.editCurrent(); event.preventDefault(); break
      case "Escape":
        this.toggleHelp(true)
        document.body.classList.remove("peek-notes", "peek-preview")
        break
    }
  }

  editCurrent() {
    if (!this.hasSlugValue) return
    window.location = `/presentations/${this.slugValue}/slides/${this.indexValue + 1}/edit`
  }
}
