# Exceptions Jump Back

<div class="cols">

```python
def read_rating(text):
    return float(text)

def average(texts):
    total = 0
    for text in texts:
        total += read_rating(text)
    return total / len(texts)

try:
    average(["8.5", "n/a"])
except ValueError as e:
    print("bad data:", e)
```

<!-- col -->

<svg viewBox="0 0 520 440" role="img" aria-label="Three frames stacked, newest on top. float('n/a') raises ValueError in read_rating. No except there, so the frame is thrown away; same in average. The exception lands in the module frame, where except ValueError catches it." style="width:100%;height:auto;max-height:64vh;color:var(--md-fg);font-family:var(--md-font-mono);font-size:20px">
<text x="4" y="20" font-size="17" fill="#2dd4bf">CALL STACK  newest on top</text>
<rect x="4" y="34" width="330" height="96" rx="7" fill="none" stroke-width="2" stroke-dasharray="7 6" style="stroke:var(--md-muted)"/>
<text x="18" y="66" font-size="20" font-weight="600" style="fill:var(--md-muted)">read_rating(text)</text>
<text x="18" y="104" font-size="18" style="fill:var(--md-highlight)">float("n/a") raises</text>
<text x="18" y="124" font-size="15" style="fill:var(--md-muted)">no except here: frame thrown away</text>
<rect x="4" y="160" width="330" height="96" rx="7" fill="none" stroke-width="2" stroke-dasharray="7 6" style="stroke:var(--md-muted)"/>
<text x="18" y="192" font-size="20" font-weight="600" style="fill:var(--md-muted)">average(texts)</text>
<text x="18" y="230" font-size="18" style="fill:var(--md-muted)">total += read_rating(text)</text>
<text x="18" y="250" font-size="15" style="fill:var(--md-muted)">no except here: frame thrown away</text>
<rect x="4" y="286" width="330" height="140" rx="7" fill="none" stroke-width="2.5" style="stroke:var(--md-accent)"/>
<text x="18" y="318" font-size="20" font-weight="600" fill="currentColor">&lt;module&gt;</text>
<line x1="4" y1="332" x2="334" y2="332" stroke-width="1.2" style="stroke:var(--md-muted)"/>
<text x="18" y="362" font-size="18" fill="currentColor">try: average(...)</text>
<text x="18" y="396" font-size="18" style="fill:var(--md-accent)">except ValueError:</text>
<text x="40" y="418" font-size="15" fill="#2dd4bf">caught: "bad data: ..."</text>
<rect x="380" y="64" width="128" height="40" rx="20" fill="none" stroke-width="2" style="stroke:var(--md-highlight)"/>
<text x="444" y="90" font-size="17" text-anchor="middle" style="fill:var(--md-highlight)">ValueError</text>
<path d="M444 106 V380 H352" fill="none" stroke-width="2.5" style="stroke:var(--md-highlight)"/>
<polygon points="338,380 352,373 352,387" style="fill:var(--md-highlight)"/>
<line x1="336" y1="96" x2="378" y2="86" stroke-width="2" style="stroke:var(--md-highlight)"/>
</svg>

</div>

<!-- notes -->
Same picture as Frames: A Namespace per Call, now with something going wrong at the top.
float("n/a") can't make a number, so it RAISES a ValueError: an object describing the problem.
Python looks for a matching except in the current frame. read_rating has none, so its frame is thrown away and the exception moves to the caller.
average has no except either: thrown away too. total is lost; average never returns.
The module's try has except ValueError, so it catches it. as e names the exception object, and the program carries on after the except block.
If nothing on the whole stack catches it, Python prints the traceback and the program stops. The traceback lists these same frames: read it from the bottom up.
Demo: 02_exceptions.ipynb, section 4 runs this exact code, then has them predict a variant with the try moved inside average.
Likely questions:
Is the frame deleted instantly? Python unwinds one frame at a time. In each frame it skips the remaining lines but still runs cleanup: a with block closes its file, and a finally block runs (next slide). Then that frame is discarded.
What happens to the local variables? The names go away with the frame, exactly like a normal return. The objects they pointed at survive if anything else still refers to them, like the list passed in from the caller; otherwise they become garbage.
Are changes undone? No. Anything already changed stays changed: if average had appended to a list passed in, the append stays even though average never finished. Exceptions jump back; they don't roll back.
How does the traceback still know the lines? The exception object keeps a reference to the traceback, which keeps the discarded frames alive until the except block ends. Python deletes the name e at the end of the except block, then they can go.
Docs say exceptions "propagate up the call stack": they picture the stack the other way round from this slide. Same thing.
