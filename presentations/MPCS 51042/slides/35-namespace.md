# A Namespace Is a Dictionary

<div class="code-sm">

```python
import textkit

x = 1000
words = ["four", "score"]
textkit.shout("hi")
```

</div>

<svg viewBox="0 0 1000 330" role="img" aria-label="main.py's namespace as a dictionary; the name textkit points to the module's own namespace dictionary holding shout and tools. textkit.shout is two lookups." style="width:100%;height:auto;max-height:46vh;color:var(--md-fg);font-family:var(--md-font-mono);font-size:22px">
<rect x="20" y="10" width="420" height="196" rx="8" fill="none" stroke-width="2.5" style="stroke:var(--md-accent)"/>
<text x="40" y="44" font-size="24" font-weight="600" fill="currentColor">main.py's namespace</text>
<text x="40" y="70" font-size="18" fill="#2dd4bf">globals()</text>
<text x="50" y="110" fill="currentColor">"x"</text>
<text x="230" y="110" font-size="20" fill="#2dd4bf">→ int 1000</text>
<text x="50" y="144" fill="currentColor">"words"</text>
<text x="230" y="144" font-size="20" fill="#2dd4bf">→ list</text>
<text x="50" y="178" fill="currentColor">"textkit"</text>
<line x1="190" y1="172" x2="544" y2="172" stroke-width="2" stroke="currentColor"/><polygon points="558,172 544,178 544,166" fill="currentColor"/>
<rect x="560" y="10" width="420" height="196" rx="8" fill="none" stroke-width="2.5" style="stroke:var(--md-accent)"/>
<text x="580" y="44" font-size="24" font-weight="600" fill="currentColor">module textkit</text>
<text x="580" y="70" font-size="18" fill="#2dd4bf">textkit.__dict__</text>
<text x="590" y="110" fill="currentColor">"shout"</text>
<text x="780" y="110" font-size="20" fill="#2dd4bf">→ function</text>
<text x="590" y="144" fill="currentColor">"tools"</text>
<text x="780" y="144" font-size="20" fill="#2dd4bf">→ module</text>
<text x="590" y="178" fill="currentColor">"__name__"</text>
<text x="780" y="178" font-size="20" fill="#2dd4bf">→ "textkit"</text>
<text x="20" y="262" font-size="24" font-weight="600" style="fill:var(--md-accent)">textkit.shout</text>
<text x="250" y="262" font-size="20" fill="currentColor">1  find "textkit" in main.py's namespace</text>
<text x="250" y="296" font-size="20" fill="currentColor">2  find "shout" in the module's namespace</text>
</svg>

<!-- notes -->
A namespace is a mapping from names to objects, and in Python it's literally a dict. globals() returns the current module's; every module object carries its own as module.__dict__.
So a dot is a lookup in someone else's namespace: textkit.shout means find "textkit" here, then "shout" in that module's dict. (random.__dict__["randint"] is random.randint: True.)
Live: print(globals().keys()) at the top of a file, then again after an import or a def: new keys appear. That's step 5 of the import slide: "bind the name" = add a key.
Two different modules can both have a name shout without clashing: they live in different dicts. That's the whole point of namespaces.
