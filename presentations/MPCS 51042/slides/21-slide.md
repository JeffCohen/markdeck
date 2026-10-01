# Threads

<svg viewBox="0 0 1000 500" role="img" aria-label="One process with shared heap, data, code, and file descriptors, and three threads each with its own stack and registers, scheduled by the kernel onto CPU cores" style="width:100%;height:auto;max-height:60vh;color:var(--md-fg);font-family:var(--md-font-mono);font-size:17px">
<g style="fill:var(--md-muted)" font-size="14" letter-spacing="2">
<text x="40" y="20">USER SPACE</text>
<text x="40" y="330">KERNEL</text>
<text x="40" y="444">HARDWARE</text>
</g>
<rect x="40" y="32" width="920" height="240" rx="10" fill="none" stroke-width="2" style="stroke:var(--md-accent)"/>
<text x="60" y="62" font-weight="600" font-size="20" fill="currentColor">python3 hello.py</text>
<text x="940" y="62" font-size="15" text-anchor="end" style="fill:var(--md-muted)">PID 4021</text>
<g style="fill:var(--md-muted)" font-size="14">
<text x="60" y="88">shared by all threads</text>
</g>
<g fill="currentColor" font-weight="600" font-size="15">
<text x="370" y="88">thread 1 (main)</text>
<text x="560" y="88">thread 2</text>
<text x="750" y="88">thread 3</text>
</g>
<g stroke="currentColor" stroke-width="1.5">
<g style="fill:var(--md-accent)" fill-opacity="0.14">
<rect x="60" y="96" width="260" height="34"/><rect x="60" y="130" width="260" height="34"/><rect x="60" y="164" width="260" height="34"/>
<rect x="370" y="96" width="170" height="68"/><rect x="560" y="96" width="170" height="68"/><rect x="750" y="96" width="170" height="68"/>
</g>
<g fill="none">
<rect x="60" y="214" width="260" height="34" rx="4"/>
<rect x="370" y="172" width="170" height="34" rx="4"/><rect x="560" y="172" width="170" height="34" rx="4"/><rect x="750" y="172" width="170" height="34" rx="4"/>
</g>
</g>
<g fill="currentColor" text-anchor="middle">
<text x="190" y="119">heap</text><text x="190" y="153">data / globals</text><text x="190" y="187">code</text>
<text x="190" y="237">fds  0  1  2</text>
<text x="455" y="136">stack ↓</text><text x="645" y="136">stack ↓</text><text x="835" y="136">stack ↓</text>
<text x="455" y="195">registers</text><text x="645" y="195">registers</text><text x="835" y="195">registers</text>
</g>
<line x1="0" y1="296" x2="1000" y2="296" stroke-width="3" style="stroke:var(--md-accent)"/>
<g stroke="currentColor" stroke-width="2">
<line x1="455" y1="206" x2="455" y2="330"/><line x1="645" y1="206" x2="645" y2="330"/><line x1="835" y1="206" x2="835" y2="330"/>
</g>
<g fill="currentColor">
<polygon points="448,328 462,328 455,342"/><polygon points="638,328 652,328 645,342"/><polygon points="828,328 842,328 835,342"/>
</g>
<rect x="40" y="344" width="920" height="52" rx="10" stroke-width="2" style="fill:var(--md-accent);fill-opacity:0.08;stroke:var(--md-accent)"/>
<text x="500" y="376" text-anchor="middle" fill="currentColor">scheduler</text>
<line x1="0" y1="418" x2="1000" y2="418" stroke-width="1.5" stroke-dasharray="6 6" style="stroke:var(--md-muted)"/>
<g stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 4">
<line x1="155" y1="396" x2="155" y2="452"/><line x1="385" y1="396" x2="385" y2="452"/><line x1="615" y1="396" x2="615" y2="452"/><line x1="845" y1="396" x2="845" y2="452"/>
</g>
<g fill="none" stroke-width="1.5" style="stroke:var(--md-muted)">
<rect x="50" y="454" width="210" height="42" rx="6"/><rect x="280" y="454" width="210" height="42" rx="6"/><rect x="510" y="454" width="210" height="42" rx="6"/><rect x="740" y="454" width="210" height="42" rx="6"/>
</g>
<g fill="currentColor" text-anchor="middle">
<text x="155" y="481">core 1</text><text x="385" y="481">core 2</text><text x="615" y="481">core 3</text><text x="845" y="481">core 4</text>
</g>
</svg>

<!-- notes -->
Same process as the Unix Process Model slide, now with three threads inside it.
Shared: heap, globals, code, open files. Any thread can read or change any object on the heap — that's what makes threads cheap to communicate, and what makes them dangerous (next slide).
Private: each thread has its own stack (its own chain of function calls and local variables) and its own registers, including the program counter — where it is in the code.
The kernel schedules threads, not processes: each thread can be placed on a different core and run at the same time.
Compare with two processes: separate memory, so they can't trip over each other — but they also can't share objects without going through the kernel (IPC).
In Python: threading.Thread(target=f).start()
