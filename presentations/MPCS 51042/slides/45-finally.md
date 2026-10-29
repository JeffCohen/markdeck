# finally Always Runs

<div class="cols">

<div class="code-sm">

```python
f = open("ratings.txt")
try:
    n = int(f.readline())
except ValueError:
    n = None
finally:
    f.close()
```

</div>

<span class="accent">The same functionality:</span>

<div class="code-sm">

```python
with open("ratings.txt") as f:
    try:
        n = int(f.readline())
    except ValueError:
        n = None
```

</div>

<!-- col -->

<svg viewBox="0 0 520 420" role="img" aria-label="Three paths. No error: try, then finally, then the program continues. A ValueError: try fails, except runs, then finally, then continue. Any other error: try fails, finally runs, then the exception jumps back to the caller. finally runs on every path." style="width:100%;height:auto;max-height:64vh;color:var(--md-fg);font-family:var(--md-font-mono);font-size:18px">
<g font-size="15" fill="#2dd4bf">
<text x="4" y="22">NO ERROR</text>
<text x="4" y="162">ValueError</text>
<text x="4" y="302">ANY OTHER ERROR</text>
</g>
<g fill="none" stroke-width="2" stroke="currentColor">
<rect x="4" y="34" width="96" height="48" rx="8"/>
<rect x="4" y="174" width="96" height="48" rx="8"/>
<rect x="4" y="314" width="96" height="48" rx="8"/>
</g>
<g text-anchor="middle" fill="currentColor"><text x="52" y="64">try ✓</text><text x="52" y="204">try ✗</text><text x="52" y="344">try ✗</text></g>
<rect x="140" y="174" width="110" height="48" rx="8" fill="none" stroke-width="2" style="stroke:var(--md-accent)"/>
<text x="195" y="204" text-anchor="middle" style="fill:var(--md-accent)">except</text>
<g fill="none" stroke-width="2.5" style="stroke:var(--md-highlight)">
<rect x="290" y="34" width="110" height="48" rx="8"/>
<rect x="290" y="174" width="110" height="48" rx="8"/>
<rect x="290" y="314" width="110" height="48" rx="8"/>
</g>
<g text-anchor="middle" style="fill:var(--md-highlight)"><text x="345" y="64">finally</text><text x="345" y="204">finally</text><text x="345" y="344">finally</text></g>
<g stroke-width="2" stroke="currentColor">
<line x1="102" y1="58" x2="276" y2="58"/><line x1="102" y1="198" x2="126" y2="198"/><line x1="252" y1="198" x2="276" y2="198"/><line x1="102" y1="338" x2="276" y2="338"/>
<line x1="402" y1="58" x2="426" y2="58"/><line x1="402" y1="198" x2="426" y2="198"/>
</g>
<g fill="currentColor">
<polygon points="288,58 276,64 276,52"/><polygon points="138,198 126,204 126,192"/><polygon points="288,198 276,204 276,192"/><polygon points="288,338 276,344 276,332"/>
<polygon points="438,58 426,64 426,52"/><polygon points="438,198 426,204 426,192"/>
</g>
<text x="444" y="64" font-size="16" fill="currentColor">go on</text>
<text x="444" y="204" font-size="16" fill="currentColor">go on</text>
<line x1="402" y1="338" x2="426" y2="338" stroke-width="2" style="stroke:var(--md-highlight)"/>
<polygon points="438,338 426,344 426,332" style="fill:var(--md-highlight)"/>
<text x="444" y="334" font-size="16" style="fill:var(--md-highlight)">jump</text>
<text x="444" y="354" font-size="16" style="fill:var(--md-highlight)">back</text>
</svg>

</div>

<!-- notes -->
finally is the cleanup block: it runs whether the try worked, failed and was caught, or failed and wasn't caught. Even a return inside the try runs finally first.
Bottom path is the answer to "what happens to the frames we skip?": while an exception jumps back, each frame it leaves still runs its finally blocks on the way out.
Use it for things that must be undone no matter what: closing a file, releasing something you borrowed.
Second code block: the same program with with. You'll rarely write the first version by hand, because with open(...) as f: is a built-in try/finally: the f.close() is gone, and the file is closed when the with block ends, on all three paths. That's what 01_files.py's comment meant by "closes the file for us when the block ends, even if something fails."
A try can have except, finally, or both. (There's also else: runs only when the try succeeded. Rare; mention only if asked.)
Demo: 02_exceptions.ipynb section 5. Predict what prints for risky("5") and risky("x").
