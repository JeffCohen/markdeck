---
label: Assignment Makes a Local (predict)
---
# Predict the Output

<svg viewBox="0 0 1000 400" role="img" aria-label="Two versions of a function using a global count: reading it prints 0, and one that assigns to it, its output not yet shown" style="width:100%;height:auto;max-height:68vh;color:var(--md-fg);font-family:var(--md-font-mono);font-size:17px">
<rect x="40" y="20" width="440" height="360" rx="8" fill="none" stroke-width="2" stroke="#2dd4bf"/>
<text x="64" y="66" font-size="21" fill="currentColor" xml:space="preserve">count = 0</text>
<text x="64" y="138" font-size="21" fill="currentColor" xml:space="preserve">def show():</text>
<text x="64" y="174" font-size="21" fill="currentColor" xml:space="preserve">    print(count)</text>
<text x="290" y="174" font-size="21" fill="#2dd4bf"># reads it</text>
<text x="64" y="246" font-size="21" fill="currentColor" xml:space="preserve">show()</text>
<line x1="64" y1="282" x2="456" y2="282" stroke-width="1" style="stroke:var(--md-muted)"/>
<text x="64" y="314" font-size="19" fill="#2dd4bf">0</text>
<rect x="520" y="20" width="440" height="360" rx="8" fill="none" stroke-width="2" style="stroke:var(--md-highlight)"/>
<text x="544" y="66" font-size="21" fill="currentColor" xml:space="preserve">count = 0</text>
<text x="544" y="138" font-size="21" fill="currentColor" xml:space="preserve">def bump():</text>
<text x="544" y="174" font-size="21" fill="currentColor" xml:space="preserve">    count += 1</text>
<text x="770" y="174" font-size="21" style="fill:var(--md-highlight)"># assigns it</text>
<text x="544" y="246" font-size="21" fill="currentColor" xml:space="preserve">bump()</text>
<line x1="544" y1="282" x2="936" y2="282" stroke-width="1" style="stroke:var(--md-muted)"/>
</svg>

<!-- notes -->
Left panel, # reads it: show has no count of its own, so the lookup goes Local, then Global, and finds the module's count. Prints 0.
Right panel, # assigns it: ask the class to predict before revealing the output. Most will guess 1.
Don't reveal yet: the next slide shows what happens.
