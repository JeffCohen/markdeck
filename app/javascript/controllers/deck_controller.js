import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["slide", "counter", "help", "progress", "notesDot"]
  static values = { count: Number, index: Number, slug: String, start: Number }

  connect() {
    const hashed = this.readHash()
    this.indexValue = window.location.hash ? hashed : (this.hasStartValue ? this.startValue : hashed)
    this.show(this.indexValue)
    this.keyHandler = this.handleKey.bind(this)
    this.hashHandler = () => {
      const idx = this.readHash()
      if (idx !== this.indexValue) this.show(idx)
    }
    this.resizeHandler = () => { if (document.body.classList.contains("peek-preview")) this.scaleThumbs() }
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
    if (!Number.isFinite(i)) return 0
    return Math.max(0, Math.min(this.countValue - 1, i))
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
    if (this.hasCounterTarget) this.counterTarget.textContent = String(idx + 1)
    if (this.hasProgressTarget && this.countValue > 0) {
      const r = parseFloat(this.progressTarget.getAttribute("r")) || 18
      const circumference = 2 * Math.PI * r
      const pct = this.countValue === 1 ? 1 : idx / (this.countValue - 1)
      this.progressTarget.style.strokeDashoffset = String(circumference * (1 - pct))
    }
    const newHash = `#${idx + 1}`
    if (window.location.hash !== newHash) {
      history.replaceState(null, "", newHash)
    }
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
  first() { this.show(0) }
  last() { this.show(this.countValue - 1) }

  goToOverview() {
    if (!this.hasSlugValue) return
    window.location = `/presentations/${this.slugValue}`
  }

  scaleThumbs() {
    const VIRTUAL_WIDTH = 1280
    this.element.querySelectorAll(".thumb-content").forEach(content => {
      const wrap = content.parentElement
      const w = wrap.clientWidth
      if (w > 0) {
        content.style.transform = `scale(${w / VIRTUAL_WIDTH})`
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
