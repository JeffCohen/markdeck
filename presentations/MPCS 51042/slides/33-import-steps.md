# What Happens at import

<svg viewBox="0 0 1000 480" role="img" aria-label="The steps of import textkit: check sys.modules and reuse it if present; otherwise search the folders on sys.path, run textkit/__init__.py top to bottom, save the module in sys.modules, and bind the name textkit. A terminal shows the package's code running on the first import only." style="width:100%;height:auto;max-height:68vh;color:var(--md-fg);font-family:var(--md-font-mono);font-size:17px">
<text x="40" y="32" font-size="22" font-weight="600" style="fill:var(--md-accent)">import textkit</text>
<rect x="40" y="56" width="520" height="62" rx="8" fill="none" stroke="currentColor" stroke-width="1.5"/>
<text x="56" y="82" font-weight="600" fill="currentColor">1  Already in sys.modules?</text>
<text x="80" y="106" font-size="14" fill="#2dd4bf">the cache of everything imported so far</text>
<line x1="100" y1="118" x2="100" y2="128" stroke-width="2" stroke="currentColor"/><polygon points="100,140 95,128 105,128" fill="currentColor"/>
<text x="110" y="134" font-size="13" fill="#2dd4bf">no</text>
<rect x="40" y="140" width="520" height="62" rx="8" fill="none" stroke="currentColor" stroke-width="1.5"/>
<text x="56" y="166" font-weight="600" fill="currentColor">2  Search sys.path, in order</text>
<text x="80" y="190" font-size="14" fill="#2dd4bf">this file's folder → standard library → .venv</text>
<line x1="100" y1="202" x2="100" y2="212" stroke-width="2" stroke="currentColor"/><polygon points="100,224 95,212 105,212" fill="currentColor"/>
<text x="110" y="218" font-size="13" fill="#2dd4bf">found</text>
<rect x="40" y="224" width="520" height="62" rx="8" fill="none" stroke="currentColor" stroke-width="1.5"/>
<text x="56" y="250" font-weight="600" fill="currentColor">3  Run textkit/__init__.py</text>
<text x="80" y="274" font-size="14" fill="#2dd4bf">top to bottom: every def, assignment, print</text>
<line x1="100" y1="286" x2="100" y2="296" stroke-width="2" stroke="currentColor"/><polygon points="100,308 95,296 105,296" fill="currentColor"/>
<text x="110" y="302" font-size="13" fill="#2dd4bf"></text>
<rect x="40" y="308" width="520" height="62" rx="8" fill="none" stroke="currentColor" stroke-width="1.5"/>
<text x="56" y="334" font-weight="600" fill="currentColor">4  Save it in sys.modules</text>
<text x="80" y="358" font-size="14" fill="#2dd4bf">sys.modules["textkit"]</text>
<line x1="100" y1="370" x2="100" y2="380" stroke-width="2" stroke="currentColor"/><polygon points="100,392 95,380 105,380" fill="currentColor"/>
<text x="110" y="386" font-size="13" fill="#2dd4bf"></text>
<rect x="40" y="392" width="520" height="62" rx="8" fill="none" stroke="currentColor" stroke-width="1.5"/>
<text x="56" y="418" font-weight="600" fill="currentColor">5  Bind the name textkit</text>
<text x="80" y="442" font-size="14" fill="#2dd4bf">in the file that did the importing</text>
<line x1="560" y1="87.0" x2="608" y2="87" stroke-width="2" style="stroke:#2dd4bf"/><polygon points="620,87 608,92 608,82" style="fill:#2dd4bf"/>
<text x="630" y="83" font-size="15" fill="#2dd4bf">yes: reuse it,</text>
<text x="630" y="103" font-size="15" fill="#2dd4bf">nothing runs again</text>
<line x1="560" y1="171.0" x2="608" y2="171" stroke-width="2" style="stroke:var(--md-highlight)"/><polygon points="620,171 608,176 608,166" style="fill:var(--md-highlight)"/>
<text x="630" y="167" font-size="15" style="fill:var(--md-highlight)">not found:</text>
<text x="630" y="187" font-size="15" style="fill:var(--md-highlight)">ModuleNotFoundError</text>
<rect x="620" y="230" width="340" height="220" rx="8" fill="none" stroke-width="1.5" style="stroke:var(--md-accent)"/>
<text x="636" y="258" font-size="14" style="fill:var(--md-accent)">main.py imports it twice:</text>
<text x="636" y="294" font-size="15" fill="currentColor">import textkit</text>
<text x="652" y="326" font-size="15" fill="#2dd4bf">running textkit/__init__.py</text>
<text x="652" y="358" font-size="15" fill="#2dd4bf">running textkit/tools.py</text>
<text x="636" y="390" font-size="15" fill="currentColor">import textkit</text>
<text x="652" y="422" font-size="15" fill="#2dd4bf">(nothing runs)</text>
</svg>

<!-- notes -->
1. sys.modules is a dict of every module already imported. If it's there, Python hands back the same module object: importing twice never runs the code twice.
2. Otherwise Python searches the folders in sys.path, in order: the running script's own folder first (that's how week 2's 01_imports.py found text_tools.py), then the standard library, then site-packages (with uv run, the project's .venv). First match wins: a file named random.py in your folder hides the real random module.
3. Python creates a new module object and runs the file top to bottom. Every top-level statement executes: defs create functions, assignments create variables, and prints print. That's why week 2's __name__ guard matters: without it, test code runs whenever someone imports you.
4. The finished module goes into sys.modules, so step 1 catches it next time.
5. Finally the name textkit is bound in the importing file, pointing at the module object. "from textkit.tools import shout" binds just shout instead.
Common misconception: "from textkit.tools import shout" does NOT run less code. All of tools.py still runs top to bottom (it has to: def shout is itself a statement), and the whole module goes into sys.modules. The only difference from "import textkit.tools" is which names you get: just shout. Other functions in tools.py exist but have no name in your file (NameError), and any unguarded test code in tools.py runs either way.
The terminal output is a real run: the second import prints nothing.
Try it: import sys; print(sys.path); print(len(sys.modules)) (already dozens before you import anything yourself).
