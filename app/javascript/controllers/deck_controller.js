import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["slide", "counter", "overview", "help", "progress", "notesDot"]
  static values = { count: Number, index: Number }

  connect() {
    this.indexValue = this.readHash()
    this.show(this.indexValue)
    this.keyHandler = this.handleKey.bind(this)
    this.hashHandler = () => {
      const idx = this.readHash()
      if (idx !== this.indexValue) this.show(idx)
    }
    this.resizeHandler = () => { if (this.isOverviewOpen()) this.scaleThumbs() }
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

  jumpTo(event) {
    const idx = parseInt(event.params.index, 10)
    this.toggleOverview(true)
    this.show(idx)
  }

  toggleOverview(forceClose) {
    if (!this.hasOverviewTarget) return
    const isHidden = this.overviewTarget.classList.contains("hidden")
    if (forceClose === true || !isHidden) {
      this.overviewTarget.classList.add("hidden")
    } else {
      this.overviewTarget.classList.remove("hidden")
      if (this.hasHelpTarget) this.helpTarget.classList.add("hidden")
      this.scaleThumbs()
      this.focusOverviewButton(this.indexValue)
    }
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

  isOverviewOpen() {
    return this.hasOverviewTarget && !this.overviewTarget.classList.contains("hidden")
  }

  overviewButtons() {
    return Array.from(this.overviewTarget.querySelectorAll("button[data-deck-index-param]"))
  }

  focusOverviewButton(idx) {
    const buttons = this.overviewButtons()
    const target = buttons[Math.max(0, Math.min(buttons.length - 1, idx))]
    if (target) target.focus()
  }

  overviewColumns(buttons) {
    if (buttons.length < 2) return 1
    const firstTop = buttons[0].offsetTop
    const nextRow = buttons.findIndex(b => b.offsetTop !== firstTop)
    return nextRow === -1 ? buttons.length : nextRow
  }

  handleOverviewKey(event) {
    const buttons = this.overviewButtons()
    if (!buttons.length) return
    const cols = this.overviewColumns(buttons)
    const focused = buttons.indexOf(document.activeElement)
    const current = focused === -1 ? 0 : focused
    let next = current

    switch (event.key) {
      case "ArrowRight":
        next = Math.min(buttons.length - 1, current + 1); break
      case "ArrowLeft":
        next = Math.max(0, current - 1); break
      case "ArrowDown":
        next = Math.min(buttons.length - 1, current + cols); break
      case "ArrowUp":
        next = Math.max(0, current - cols); break
      case "Home":
        next = 0; break
      case "End":
        next = buttons.length - 1; break
      default:
        return false
    }

    event.preventDefault()
    buttons[next].focus()
    return true
  }

  toggleHelp(forceClose) {
    if (!this.hasHelpTarget) return
    const isHidden = this.helpTarget.classList.contains("hidden")
    if (forceClose === true || !isHidden) {
      this.helpTarget.classList.add("hidden")
    } else {
      this.helpTarget.classList.remove("hidden")
      if (this.hasOverviewTarget) this.overviewTarget.classList.add("hidden")
    }
  }

  handleKey(event) {
    if (event.metaKey || event.ctrlKey || event.altKey) return
    const tag = (event.target.tagName || "").toUpperCase()
    if (tag === "INPUT" || tag === "TEXTAREA") return

    if (this.isOverviewOpen()) {
      if (this.handleOverviewKey(event)) return
      if (event.key === "Escape" || event.key === "o" || event.key === "O") {
        this.toggleOverview(true)
        event.preventDefault()
        return
      }
      return
    }

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
        this.first(); event.preventDefault(); break
      case "End":
        this.last(); event.preventDefault(); break
      case "o":
      case "O":
        this.toggleOverview(); event.preventDefault(); break
      case "p":
      case "P":
        this.togglePeek("preview"); event.preventDefault(); break
      case "n":
      case "N":
        this.togglePeek("notes"); event.preventDefault(); break
      case "?":
        this.toggleHelp(); event.preventDefault(); break
      case "Escape":
        this.toggleOverview(true)
        this.toggleHelp(true)
        document.body.classList.remove("peek-notes", "peek-preview")
        break
    }
  }
}
