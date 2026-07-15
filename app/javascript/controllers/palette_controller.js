import { Controller } from "@hotwired/stimulus"

// Cmd+K / Ctrl+K quick switcher.
// Fuzzy-search by label, heading, image alt, or "Slide N".
export default class extends Controller {
  static targets = ["root", "input", "results"]
  static values  = { slides: Array }

  connect() {
    this._selected = 0
    this._filtered = []
    document.addEventListener("keydown", this._onKey = (e) => this._handleKey(e))
  }

  disconnect() {
    document.removeEventListener("keydown", this._onKey)
  }

  _handleKey(e) {
    if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
      e.preventDefault()
      this.open()
    }
  }

  open() {
    this.rootTarget.classList.remove("hidden")
    this.inputTarget.value = ""
    this.filter()
    setTimeout(() => this.inputTarget.focus(), 0)
  }

  close() {
    this.rootTarget.classList.add("hidden")
  }

  backdropClick() { this.close() }
  stopPropagation(e) { e.stopPropagation() }

  filter() {
    const q = this.inputTarget.value.trim().toLowerCase()
    const slides = this.slidesValue
    const scored = slides.map(s => ({ slide: s, score: scoreSlide(s, q) }))
    const matches = q
      ? scored.filter(x => x.score > 0).sort((a, b) => b.score - a.score)
      : scored.map(x => ({ slide: x.slide, score: 1 }))
    this._filtered = matches.map(x => x.slide)
    this._selected = 0
    this._render()
  }

  keydown(e) {
    if (e.key === "Escape") {
      e.preventDefault()
      this.close()
      return
    }
    if (e.key === "ArrowDown") {
      e.preventDefault()
      this._selected = Math.min(this._selected + 1, this._filtered.length - 1)
      this._render()
      return
    }
    if (e.key === "ArrowUp") {
      e.preventDefault()
      this._selected = Math.max(this._selected - 1, 0)
      this._render()
      return
    }
    if (e.key === "Enter") {
      e.preventDefault()
      const pick = this._filtered[this._selected]
      if (pick) window.location = pick.url
    }
  }

  _render() {
    const html = this._filtered.map((s, i) => {
      const sel = i === this._selected ? 'aria-selected="true"' : ""
      const sub = labelFor(s, "subtitle")
      return `<li ${sel} data-url="${s.url}">
                <span class="palette__num">${s.n}</span>
                <span class="palette__title">${escapeHtml(labelFor(s, "primary"))}</span>
                ${sub ? `<span class="palette__hint">${escapeHtml(sub)}</span>` : ""}
              </li>`
    }).join("")
    this.resultsTarget.innerHTML = html
    this.resultsTarget.querySelectorAll("li").forEach(li => {
      li.addEventListener("click", () => { window.location = li.dataset.url })
      li.addEventListener("mouseenter", () => {
        const idx = Array.from(this.resultsTarget.children).indexOf(li)
        this._selected = idx
        this._render()
      })
    })
    // Scroll selected into view.
    const sel = this.resultsTarget.querySelector('[aria-selected="true"]')
    if (sel) sel.scrollIntoView({ block: "nearest" })
  }
}

function labelFor(s, slot) {
  const candidates = [s.label, s.heading, s.image_alt].filter(Boolean)
  if (slot === "primary")   return candidates[0] || `Slide ${s.n}`
  if (slot === "subtitle")  return candidates[1] || ""
  return ""
}

// Subsequence-with-bonus scoring: characters of `q` must appear in order in
// `text`; consecutive matches and start-of-word matches score higher.
function fuzzyScore(text, q) {
  if (!q) return 1
  text = text.toLowerCase()
  let ti = 0, qi = 0, score = 0, consecutive = 0
  while (ti < text.length && qi < q.length) {
    if (text[ti] === q[qi]) {
      let bonus = 1
      if (consecutive > 0)              bonus += 2
      if (ti === 0 || /\W/.test(text[ti - 1])) bonus += 3
      score += bonus
      consecutive++
      qi++
    } else {
      consecutive = 0
    }
    ti++
  }
  return qi === q.length ? score : 0
}

function scoreSlide(s, q) {
  if (!q) return 1
  const hay = [
    s.label   || "",
    s.heading || "",
    s.image_alt || "",
    `slide ${s.n}`,
  ].join(" • ").toLowerCase()
  return fuzzyScore(hay, q)
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]))
}
