# The Unix Process Model

<svg viewBox="0 0 1000 520" role="img" aria-label="Two processes in user space, each with private memory and file descriptors, making system calls into the kernel, which manages the hardware" style="width:100%;height:auto;max-height:60vh;color:var(--md-fg);font-family:var(--md-font-mono);font-size:17px">
<g style="fill:var(--md-muted)" font-size="14" letter-spacing="2">
<text x="40" y="20">USER SPACE</text>
<text x="40" y="342">KERNEL</text>
<text x="40" y="462">HARDWARE</text>
</g>
<g style="color:var(--md-accent)" fill="none" stroke="currentColor" stroke-width="2">
<rect x="40" y="32" width="430" height="248" rx="10"/>
<rect x="530" y="32" width="430" height="248" rx="10"/>
</g>
<g fill="currentColor" font-weight="600" font-size="20">
<text x="60" y="62">python3 hello.py</text>
<text x="550" y="62">bash</text>
</g>
<g style="fill:var(--md-muted)" font-size="15" text-anchor="end">
<text x="450" y="62">PID 4021</text>
<text x="940" y="62">PID 3990</text>
</g>
<g style="fill:var(--md-muted)" font-size="14">
<text x="60" y="88">memory</text>
<text x="290" y="88">file descriptors</text>
<text x="550" y="88">memory</text>
<text x="780" y="88">file descriptors</text>
</g>
<g stroke="currentColor" stroke-width="1.5">
<g style="fill:var(--md-accent)" fill-opacity="0.14">
<rect x="60" y="96" width="200" height="34"/><rect x="60" y="164" width="200" height="34"/><rect x="60" y="198" width="200" height="34"/><rect x="60" y="232" width="200" height="34"/>
<rect x="550" y="96" width="200" height="34"/><rect x="550" y="164" width="200" height="34"/><rect x="550" y="198" width="200" height="34"/><rect x="550" y="232" width="200" height="34"/>
</g>
<g fill="none" stroke-dasharray="4 4" style="stroke:var(--md-muted)">
<rect x="60" y="130" width="200" height="34"/>
<rect x="550" y="130" width="200" height="34"/>
</g>
<g fill="none">
<rect x="290" y="96" width="160" height="30" rx="4"/><rect x="290" y="134" width="160" height="30" rx="4"/><rect x="290" y="172" width="160" height="30" rx="4"/>
<rect x="780" y="96" width="160" height="30" rx="4"/><rect x="780" y="134" width="160" height="30" rx="4"/><rect x="780" y="172" width="160" height="30" rx="4"/>
</g>
</g>
<g fill="currentColor" text-anchor="middle">
<text x="160" y="119">stack ↓</text><text x="160" y="187">heap ↑</text><text x="160" y="221">data</text><text x="160" y="255">code</text>
<text x="650" y="119">stack ↓</text><text x="650" y="187">heap ↑</text><text x="650" y="221">data</text><text x="650" y="255">code</text>
</g>
<g fill="currentColor">
<text x="304" y="117">0  stdin</text><text x="304" y="155">1  stdout</text><text x="304" y="193">2  stderr</text>
<text x="794" y="117">0  stdin</text><text x="794" y="155">1  stdout</text><text x="794" y="193">2  stderr</text>
</g>
<line x1="0" y1="306" x2="1000" y2="306" stroke-width="3" style="stroke:var(--md-accent)"/>
<rect x="420" y="292" width="160" height="28" style="fill:var(--md-bg)"/>
<text x="500" y="312" text-anchor="middle" font-size="15" letter-spacing="1" style="fill:var(--md-accent)">system calls</text>
<g stroke="currentColor" stroke-width="2">
<line x1="255" y1="280" x2="255" y2="340"/>
<line x1="745" y1="280" x2="745" y2="340"/>
</g>
<g fill="currentColor">
<polygon points="248,338 262,338 255,352"/>
<polygon points="738,338 752,338 745,352"/>
</g>
<g fill="currentColor" font-size="15">
<text x="267" y="340">write(1, …)</text>
<text x="757" y="340">read(0, …)</text>
</g>
<rect x="40" y="354" width="920" height="64" rx="10" stroke-width="2" style="fill:var(--md-accent);fill-opacity:0.08;stroke:var(--md-accent)"/>
<g fill="none" stroke="currentColor" stroke-width="1.5">
<rect x="50" y="365" width="210" height="42" rx="6"/><rect x="280" y="365" width="210" height="42" rx="6"/><rect x="510" y="365" width="210" height="42" rx="6"/><rect x="740" y="365" width="210" height="42" rx="6"/>
</g>
<g fill="currentColor" text-anchor="middle">
<text x="155" y="392">scheduler</text><text x="385" y="392">memory manager</text><text x="615" y="392">file system</text><text x="845" y="392">drivers</text>
</g>
<line x1="0" y1="436" x2="1000" y2="436" stroke-width="1.5" stroke-dasharray="6 6" style="stroke:var(--md-muted)"/>
<g fill="none" stroke-width="1.5" style="stroke:var(--md-muted)">
<rect x="50" y="474" width="210" height="42" rx="6"/><rect x="280" y="474" width="210" height="42" rx="6"/><rect x="510" y="474" width="210" height="42" rx="6"/><rect x="740" y="474" width="210" height="42" rx="6"/>
</g>
<g fill="currentColor" text-anchor="middle">
<text x="155" y="501">CPU cores</text><text x="385" y="501">RAM</text><text x="615" y="501">disk</text><text x="845" y="501">network</text>
</g>
</svg>

<!-- notes -->
Each process gets its own private memory (code, data, heap, stack) — tie back to the memory slides. Neither process can see the other's memory.
The accent line is the user/kernel boundary. A process can't touch hardware directly; it asks the kernel via a system call. Python's print() ends up as write() on file descriptor 1.
Every process starts with three file descriptors: 0 stdin, 1 stdout, 2 stderr.
The kernel shares out the hardware: the scheduler hands out CPU time, the memory manager hands out RAM, the file system and drivers handle disk and network.
Sets up the next slides: threads = a second stack inside one process; GIL = only one thread runs Python at a time; IPC = data between processes has to go through the kernel.
