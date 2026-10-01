# Where Processes Come From

<svg viewBox="0 0 1000 490" role="img" aria-label="Process tree from init to Terminal to bash to python3 and ls, and bash starting python3 with fork then exec" style="width:100%;height:auto;max-height:68vh;color:var(--md-fg);font-family:var(--md-font-mono);font-size:18px">
<g style="fill:var(--md-muted)" font-size="14" letter-spacing="2">
<text x="40" y="24">PROCESS TREE</text>
<text x="620" y="24">HOW ZSH STARTS PYTHON</text>
</g>
<g fill="none" stroke="currentColor" stroke-width="1.5">
<path d="M65,106 V168 H90"/>
<path d="M115,196 V258 H140"/>
<path d="M165,286 V438 M165,348 H190 M165,438 H190"/>
</g>
<g fill="none" stroke="currentColor" stroke-width="1.5">
<rect x="40" y="50" width="290" height="56" rx="8"/>
<rect x="90" y="140" width="290" height="56" rx="8"/>
<rect x="140" y="230" width="290" height="56" rx="8"/>
<rect x="190" y="410" width="290" height="56" rx="8"/>
<rect x="620" y="60" width="300" height="64" rx="8"/>
<rect x="620" y="184" width="300" height="64" rx="8" stroke-dasharray="6 5"/>
</g>
<g style="color:var(--md-accent)" stroke="currentColor" stroke-width="2.5">
<rect x="190" y="320" width="290" height="56" rx="8" fill="currentColor" fill-opacity="0.12"/>
<rect x="620" y="308" width="300" height="64" rx="8" fill="currentColor" fill-opacity="0.12"/>
</g>
<g fill="currentColor" font-weight="600">
<text x="56" y="85">init</text>
<text x="106" y="175">Terminal</text>
<text x="156" y="265">bash</text>
<text x="206" y="355">python3 hello.py</text>
<text x="206" y="445">ls</text>
<text x="636" y="99">bash</text>
<text x="636" y="223">bash (copy)</text>
<text x="636" y="347">python3 hello.py</text>
</g>
<g style="fill:var(--md-muted)" font-size="15" text-anchor="end">
<text x="314" y="85">PID 1</text>
<text x="364" y="175">PID 812</text>
<text x="414" y="265">PID 3990</text>
<text x="464" y="355">PID 4021</text>
<text x="464" y="445">PID 4030</text>
<text x="904" y="99">PID 3990</text>
<text x="904" y="223">PID 4021</text>
<text x="904" y="347">PID 4021</text>
</g>
<g stroke="currentColor" stroke-width="2">
<line x1="770" y1="124" x2="770" y2="172"/>
<line x1="770" y1="248" x2="770" y2="296"/>
</g>
<g fill="currentColor">
<polygon points="763,170 777,170 770,184"/>
<polygon points="763,294 777,294 770,308"/>
</g>
<g style="fill:var(--md-accent)" font-weight="600">
<text x="788" y="160">fork()</text>
<text x="788" y="284">exec()</text>
</g>
</svg>

<!-- notes -->
Every process has a parent. PID 1 (init — launchd on macOS, systemd on Linux) is the ancestor of everything. Try: ps -ef, or pstree.
Same PIDs as the previous slide: python3 is PID 4021, its parent bash is PID 3990.
A shell starts a program in two steps. fork() makes an exact copy of bash — same memory, same open file descriptors — with a new PID. exec() then replaces the copy's program with python3, keeping the PID and the file descriptors.
That's why python3 inherits the terminal as stdin/stdout/stderr: the file descriptors survive both fork and exec.
When python3 exits, bash (the parent) collects its exit status — that's $? in the shell.
