---
label: Assignment Makes a Local (reveal)
---
# Assignment Makes a Local

<svg viewBox="0 0 1000 400" role="img" aria-label="Two versions of a function using a global count: reading it prints 0, but assigning to it raises UnboundLocalError" style="width:100%;height:auto;max-height:68vh;color:var(--md-fg);font-family:var(--md-font-mono);font-size:17px">
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
<text x="544" y="314" font-size="19" fill="#f87171">UnboundLocalError:</text>
<text x="544" y="340" font-size="19" fill="#f87171">cannot access local</text>
<text x="544" y="366" font-size="19" fill="#f87171">variable 'count'</text>
</svg>

<!-- notes -->
The rule: if a function ASSIGNS a name anywhere in its body (count += 1, count = ..., for count in ...), that name is LOCAL for the whole function. Python decides this when it reads the def, before anything runs.
count += 1 means count = count + 1, so it first reads count. The local count exists but has no value yet, so: UnboundLocalError. The message says it outright: "local variable 'count'".
Link back to the Frames slide: that's the same "not set" cell we saw in average's table. The name has a row in the local table, but no value yet.
Follow-up question: what if bump did count = 5 instead? No error: it creates a separate local count, and the module's count stays 0. Same name, two tables.
The fix to teach: pass the value in and return the result. def bump(count): return count + 1, then count = bump(count). That's a pure function, which comes up again in 06_functional_basics later today.
Next slide's code uses global counter: the global keyword tells Python this name lives in the module's namespace, so bind it there. It works, but the function now depends on and changes shared state, which is exactly what goes wrong with threads.
