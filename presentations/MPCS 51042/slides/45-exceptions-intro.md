# When Things Go Wrong

<svg viewBox="0 0 1000 430" role="img" aria-label="int of 89% can't be done, so Python raises a ValueError object holding a message. Two outcomes: if a try/except catches it, the program handles it and keeps going; if nothing catches it, Python prints a traceback and the program stops." style="width:100%;height:auto;max-height:68vh;color:var(--md-fg);font-family:var(--md-font-mono);font-size:18px">
<rect x="20" y="20" width="250" height="56" rx="8" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="145" y="55" text-anchor="middle" font-size="20" fill="currentColor">n = int("89%")</text>
<line x1="272" y1="48" x2="364" y2="48" stroke-width="2.5" style="stroke:var(--md-highlight)"/>
<polygon points="378,48 364,55 364,41" style="fill:var(--md-highlight)"/>
<text x="322" y="36" text-anchor="middle" font-size="16" style="fill:var(--md-highlight)">raise</text>
<rect x="380" y="10" width="590" height="80" rx="8" fill="none" stroke-width="2.5" style="stroke:var(--md-highlight)"/>
<text x="398" y="40" font-size="19" font-weight="600" style="fill:var(--md-highlight)">ValueError</text>
<text x="530" y="40" font-size="15" fill="#2dd4bf">an object, like any other</text>
<text x="398" y="72" font-size="16" fill="currentColor">"invalid literal for int() with base 10: '89%'"</text>
<path d="M500 92 V128 H240 V150" fill="none" stroke-width="2" style="stroke:var(--md-accent)"/>
<polygon points="240,164 233,150 247,150" style="fill:var(--md-accent)"/>
<path d="M800 92 V150" fill="none" stroke-width="2" style="stroke:var(--md-highlight)"/>
<polygon points="800,164 793,150 807,150" style="fill:var(--md-highlight)"/>
<rect x="20" y="168" width="440" height="200" rx="8" fill="none" stroke-width="2" style="stroke:var(--md-accent)"/>
<text x="40" y="200" font-size="16" letter-spacing="2" style="fill:var(--md-accent)">CAUGHT</text>
<text x="40" y="240" fill="currentColor">try:</text>
<text x="76" y="268" fill="currentColor">n = int("89%")</text>
<text x="40" y="296" style="fill:var(--md-accent)">except ValueError:</text>
<text x="76" y="324" fill="currentColor">n = None</text>
<text x="40" y="356" font-size="15" fill="#2dd4bf">handled: the program keeps going</text>
<rect x="500" y="168" width="480" height="200" rx="8" fill="none" stroke-width="2" style="stroke:var(--md-highlight)"/>
<text x="520" y="200" font-size="16" letter-spacing="2" style="fill:var(--md-highlight)">NOT CAUGHT</text>
<text x="520" y="240" font-size="15" style="fill:var(--md-muted)">Traceback (most recent call last):</text>
<text x="536" y="264" font-size="15" style="fill:var(--md-muted)">File "demo.py", line 1, in &lt;module&gt;</text>
<text x="552" y="288" font-size="15" style="fill:var(--md-muted)">n = int("89%")</text>
<text x="520" y="318" font-size="15" fill="currentColor">ValueError: invalid literal ...</text>
<line x1="520" y1="324" x2="800" y2="324" stroke-width="1.5" style="stroke:var(--md-highlight)"/>
<text x="812" y="322" font-size="14" style="fill:var(--md-highlight)">read me first</text>
<text x="520" y="356" font-size="15" fill="#2dd4bf">the program stops</text>
<text x="20" y="412" font-size="15" style="fill:var(--md-muted);white-space:pre">ValueError   TypeError   KeyError   IndexError   NameError   FileNotFoundError   ZeroDivisionError</text>
</svg>

<!-- notes -->
Callback to the last slide: not every conversion can work. "89%" isn't a number, so int() can't build one.
Instead of returning some wrong value, int() RAISES an exception: it stops what it's doing and hands back an exception object. That object is an ordinary Python object: it has a type (ValueError) and a message.
From there, two outcomes. Caught: a try/except that names this type of exception catches it, runs the except block, and the program carries on after it. Not caught: Python prints a traceback and the program stops.
Read a traceback from the bottom: the last line is the exception type and the message. The lines above it say where it happened, most recent call last.
The bottom row: exceptions they've already met. KeyError (missing dict key), IndexError (MyList's x[3]), NameError (a typo), TypeError (word[0] = "H"), FileNotFoundError (01_files.py's last TODO), ZeroDivisionError (the notebook's "your turn").
Next slide: what "not caught here" means when the error happens deep inside function calls.
Demo after this slide: 02_exceptions.ipynb sections 2 and 3 (reading a traceback, try/except).
