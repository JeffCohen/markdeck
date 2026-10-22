# Eager vs. Lazy

<svg viewBox="0 0 1000 430" role="img" aria-label="Eager: the list comprehension builds all five squares right away. Lazy: the generator expression has handed out 0 and 1, is paused at n = 2, and makes 4 only when next() asks; 9 and 16 don't exist yet." style="width:100%;height:auto;max-height:68vh;color:var(--md-fg);font-family:var(--md-font-mono);font-size:20px">
<text x="20" y="34" font-size="22" font-weight="600" fill="currentColor">[n * n for n in range(5)]</text>
<text x="20" y="62" font-size="16" fill="#2dd4bf">EAGER  all built now, all in memory</text>
<g fill="none" stroke="currentColor" stroke-width="1.8">
<rect x="20" y="80" width="90" height="56" rx="6"/><rect x="110" y="80" width="90" height="56" rx="6"/><rect x="200" y="80" width="90" height="56" rx="6"/>
<rect x="290" y="80" width="90" height="56" rx="6"/><rect x="380" y="80" width="90" height="56" rx="6"/>
</g>
<g text-anchor="middle" fill="currentColor"><text x="65" y="115">0</text><text x="155" y="115">1</text><text x="245" y="115">4</text><text x="335" y="115">9</text><text x="425" y="115">16</text></g>
<line x1="20" y1="190" x2="980" y2="190" stroke-width="1" style="stroke:var(--md-muted)"/>
<text x="20" y="236" font-size="22" font-weight="600" fill="currentColor">(n * n for n in range(5))</text>
<text x="20" y="264" font-size="16" fill="#2dd4bf">LAZY  one at a time, only when asked</text>
<g text-anchor="middle" font-size="18" style="fill:var(--md-muted)"><text x="65" y="330">0</text><text x="155" y="330">1</text></g>
<text x="110" y="364" font-size="14" text-anchor="middle" style="fill:var(--md-muted)">already handed out</text>
<rect x="230" y="290" width="250" height="70" rx="12" fill="none" stroke-width="2.5" style="stroke:var(--md-accent)"/>
<text x="355" y="320" font-size="19" text-anchor="middle" fill="currentColor">generator</text>
<text x="355" y="346" font-size="16" text-anchor="middle" style="fill:var(--md-accent)">paused at n = 2</text>
<line x1="482" y1="325" x2="606" y2="325" stroke-width="2.5" style="stroke:var(--md-highlight)"/>
<polygon points="620,325 606,332 606,318" style="fill:var(--md-highlight)"/>
<text x="544" y="312" font-size="17" text-anchor="middle" style="fill:var(--md-highlight)">next()</text>
<rect x="624" y="297" width="90" height="56" rx="6" fill="none" stroke-width="2.5" style="stroke:var(--md-highlight)"/>
<text x="669" y="332" text-anchor="middle" fill="currentColor">4</text>
<g fill="none" stroke-width="1.5" stroke-dasharray="6 6" style="stroke:var(--md-muted)">
<rect x="760" y="297" width="90" height="56" rx="6"/><rect x="860" y="297" width="90" height="56" rx="6"/>
</g>
<g text-anchor="middle" font-size="18" style="fill:var(--md-muted)"><text x="805" y="332">9?</text><text x="905" y="332">16?</text></g>
<text x="855" y="384" font-size="14" text-anchor="middle" style="fill:var(--md-muted)">not made yet</text>
</svg>

<!-- notes -->
Brackets vs. parentheses: one character apart, very different behavior.
Eager: the list comprehension runs the whole loop before the next line of your program. Every result exists at once. A million squares: about 8 MB for the list alone (04_lazy.ipynb shows sys.getsizeof).
Lazy: the generator expression runs nothing at first. It's a paused loop that remembers where it is (n = 2 here), not what it has made. About 200 bytes, however long the sequence.
Each next() runs the loop just far enough to make one more value, hands it out, and pauses again. Values already handed out are gone: a generator can be used only once (that's why the second list(shouted) in 03_map_filter was empty).
When nothing is left, next() raises StopIteration: an exception, from the first part of class. A for loop calls next() for you and stops when it sees StopIteration.
map and filter objects are lazy in exactly this way. So are files: for line in f reads one line at a time.
yield: a whole function body that pauses like this. Demo: 04_lazy.ipynb, countdown(). Calling it prints nothing; each next() runs to the next yield.
Why bother: huge or endless data (a 10 GB log file, naturals()), and you can stop early (any() stops at the first True).
