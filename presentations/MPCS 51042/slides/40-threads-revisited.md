# Why Week 1's Threads Raced

<div class="code-sm">

```python
counter = 0
def increment(n):
    return n + 1
def work():
    global counter
    for _ in range(1_000_000):
        counter = increment(counter)
```

</div>

<svg viewBox="0 0 1000 250" role="img" aria-label="One shared module namespace holds counter. Four threads each have an increment frame with a private n and a work frame that says global counter. Two threads hold the same n." style="width:100%;height:auto;max-height:46vh;color:var(--md-fg);font-family:var(--md-font-mono);font-size:22px">
<rect x="230" y="4" width="540" height="68" rx="8" fill="none" stroke-width="2.5" style="stroke:var(--md-highlight)"/>
<text x="250" y="32" font-size="22" font-weight="600" fill="currentColor">module namespace</text>
<text x="480" y="32" font-size="18" style="fill:var(--md-highlight)">shared by every thread</text>
<text x="250" y="62" fill="currentColor">counter → 52,310</text>
<line x1="135" y1="102" x2="390" y2="75" stroke-width="2" style="stroke:var(--md-highlight)"/><polygon points="404,74 391,81 389,69" style="fill:var(--md-highlight)"/>
<text x="135.0" y="120" font-size="19" font-weight="600" text-anchor="middle" fill="currentColor">thread 1</text>
<rect x="20" y="128" width="230" height="66" rx="8" fill="none" stroke-width="2" stroke="currentColor"/>
<text x="34" y="152" font-size="19" font-weight="600" fill="currentColor">increment(n)</text>
<text x="44" y="182" fill="#2dd4bf">n → 52,310</text>
<rect x="20" y="200" width="230" height="44" rx="8" fill="none" stroke-width="2" stroke="currentColor"/>
<text x="32" y="229" font-size="18" font-weight="600" fill="currentColor">work()</text>
<text x="106" y="229" font-size="16" style="fill:var(--md-highlight)">global counter</text>
<line x1="378" y1="102" x2="455" y2="78" stroke-width="2" style="stroke:var(--md-highlight)"/><polygon points="468,74 456,84 453,72" style="fill:var(--md-highlight)"/>
<text x="378.0" y="120" font-size="19" font-weight="600" text-anchor="middle" fill="currentColor">thread 2</text>
<rect x="263" y="128" width="230" height="66" rx="8" fill="none" stroke-width="2" stroke="currentColor"/>
<text x="277" y="152" font-size="19" font-weight="600" fill="currentColor">increment(n)</text>
<text x="287" y="182" fill="#2dd4bf">n → 52,310</text>
<rect x="263" y="200" width="230" height="44" rx="8" fill="none" stroke-width="2" stroke="currentColor"/>
<text x="275" y="229" font-size="18" font-weight="600" fill="currentColor">work()</text>
<text x="349" y="229" font-size="16" style="fill:var(--md-highlight)">global counter</text>
<line x1="621" y1="102" x2="545" y2="78" stroke-width="2" style="stroke:var(--md-highlight)"/><polygon points="532,74 547,72 544,84" style="fill:var(--md-highlight)"/>
<text x="621.0" y="120" font-size="19" font-weight="600" text-anchor="middle" fill="currentColor">thread 3</text>
<rect x="506" y="128" width="230" height="66" rx="8" fill="none" stroke-width="2" stroke="currentColor"/>
<text x="520" y="152" font-size="19" font-weight="600" fill="currentColor">increment(n)</text>
<text x="530" y="182" fill="#2dd4bf">n → 52,309</text>
<rect x="506" y="200" width="230" height="44" rx="8" fill="none" stroke-width="2" stroke="currentColor"/>
<text x="518" y="229" font-size="18" font-weight="600" fill="currentColor">work()</text>
<text x="592" y="229" font-size="16" style="fill:var(--md-highlight)">global counter</text>
<line x1="864" y1="102" x2="610" y2="75" stroke-width="2" style="stroke:var(--md-highlight)"/><polygon points="596,74 611,69 609,81" style="fill:var(--md-highlight)"/>
<text x="864.0" y="120" font-size="19" font-weight="600" text-anchor="middle" fill="currentColor">thread 4</text>
<rect x="749" y="128" width="230" height="66" rx="8" fill="none" stroke-width="2" stroke="currentColor"/>
<text x="763" y="152" font-size="19" font-weight="600" fill="currentColor">increment(n)</text>
<text x="773" y="182" fill="#2dd4bf">n → 52,308</text>
<rect x="749" y="200" width="230" height="44" rx="8" fill="none" stroke-width="2" stroke="currentColor"/>
<text x="761" y="229" font-size="18" font-weight="600" fill="currentColor">work()</text>
<text x="835" y="229" font-size="16" style="fill:var(--md-highlight)">global counter</text>
</svg>

<!-- notes -->
Private: each thread's frames, so each has its own n. Shared: the module namespace, so there's one counter.
Each thread has its own call stack (week 1's Threads slide), so every frame is private: four increment frames, four separate n's. No thread can touch another's n.
But all threads run code from the same module, so they share ONE module namespace, and global counter makes work() bind counter there.
The race in names: threads 1 and 2 both read counter = 52,310 into their own n. Both compute 52,311 and both store it. Two increments, one update: that's how 4,000,000 comes out short.
A lock (week 1's Fix slide) makes "read counter, compute, store counter" happen as one step.
