# Python's GIL

<svg viewBox="0 0 1000 400" role="img" aria-label="Timelines of two threads. With the GIL, only one thread runs Python at a time, and threads swap; during I/O the GIL is released. Free-threaded Python runs both at once." style="width:100%;height:auto;max-height:60vh;color:var(--md-fg);font-family:var(--md-font-mono);font-size:17px">
<g style="fill:var(--md-muted)" font-size="14" letter-spacing="2">
<text x="40" y="24">CPYTHON WITH THE GIL</text>
<text x="40" y="200">FREE-THREADED PYTHON (3.14t)</text>
</g>
<g fill="currentColor">
<text x="40" y="71">thread 1</text><text x="40" y="121">thread 2</text>
<text x="40" y="247">thread 1</text><text x="40" y="297">thread 2</text>
</g>
<g style="fill:var(--md-accent)">
<rect x="180" y="50" width="150" height="30" rx="3"/><rect x="480" y="50" width="120" height="30" rx="3"/><rect x="800" y="50" width="160" height="30" rx="3"/>
<rect x="330" y="100" width="150" height="30" rx="3"/><rect x="600" y="100" width="200" height="30" rx="3"/>
<rect x="180" y="226" width="780" height="30" rx="3"/>
<rect x="180" y="276" width="780" height="30" rx="3"/>
</g>
<g font-size="14" font-weight="600" text-anchor="middle" style="fill:var(--md-bg)">
<text x="255" y="70">GIL</text><text x="540" y="70">GIL</text><text x="880" y="70">GIL</text>
<text x="405" y="120">GIL</text><text x="700" y="120">GIL</text>
</g>
<g fill="none" stroke-width="1.5" stroke-dasharray="5 4" style="stroke:var(--md-muted)">
<rect x="331" y="51" width="148" height="28" rx="3"/>
<rect x="181" y="101" width="148" height="28" rx="3"/><rect x="481" y="101" width="118" height="28" rx="3"/><rect x="801" y="101" width="158" height="28" rx="3"/>
</g>
<rect x="600" y="50" width="200" height="30" rx="3" style="fill:var(--md-muted);fill-opacity:0.45"/>
<text x="700" y="70" text-anchor="middle" font-size="14" fill="currentColor">read()</text>
<g stroke-width="1.5" style="stroke:var(--md-muted)">
<line x1="180" y1="150" x2="950" y2="150"/>
<line x1="180" y1="326" x2="950" y2="326"/>
</g>
<g style="fill:var(--md-muted)">
<polygon points="948,145 960,150 948,155"/>
<polygon points="948,321 960,326 948,331"/>
</g>
<g style="fill:var(--md-muted)" font-size="14" text-anchor="end">
<text x="960" y="172">time</text>
<text x="960" y="348">time</text>
</g>
<g font-size="15">
<rect x="180" y="374" width="40" height="18" rx="3" style="fill:var(--md-accent)"/>
<text x="230" y="389" fill="currentColor">running Python</text>
<rect x="420" y="375" width="40" height="16" rx="3" fill="none" stroke-width="1.5" stroke-dasharray="5 4" style="stroke:var(--md-muted)"/>
<text x="470" y="389" fill="currentColor">waiting for the GIL</text>
<rect x="700" y="374" width="40" height="18" rx="3" style="fill:var(--md-muted);fill-opacity:0.45"/>
<text x="750" y="389" fill="currentColor">I/O, GIL released</text>
</g>
</svg>

<!-- notes -->
The GIL (Global Interpreter Lock) is one lock per CPython process. A thread must hold it to run Python bytecode.
Top: two threads, but only one runs Python at a time. The interpreter asks the running thread to hand the GIL over every 5 ms (sys.getswitchinterval()). So CPU-bound work gets no faster with threads — compare with the previous slide, where the kernel could put each thread on its own core.
The gray block: thread 1 is waiting on I/O (a file, the network). Blocking I/O releases the GIL, so thread 2 runs meanwhile. That's why threads still help for I/O-bound programs: downloads, servers, waiting on users.
Why it exists: CPython's memory management (reference counting from week 1) isn't thread-safe on its own; one big lock was the simple, fast way to protect it.
For CPU-bound parallelism: multiprocessing (separate processes, each with its own GIL — but then you need IPC), or C extensions like NumPy that release the GIL.
Bottom: Python 3.13 added an optional free-threaded build (python3.13t) with no GIL (PEP 703); 3.14 made it officially supported (PEP 779), but it's still not the default.
The GIL does NOT make your code thread-safe: it protects the interpreter's own bookkeeping, not your read-then-write. The Gotchas race lost half its updates with the GIL on.
