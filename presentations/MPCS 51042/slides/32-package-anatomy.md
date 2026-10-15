# Anatomy of a Package

<svg viewBox="0 0 1000 440" role="img" aria-label="A folder tree: my_app holds main.py and the textkit package, which holds __init__.py, tools.py, __pycache__, and a games subpackage with its own __init__.py and dice.py. Beside it, three import statements and the files each one runs." style="width:100%;height:auto;max-height:68vh;color:var(--md-fg);font-family:var(--md-font-mono);font-size:18px">
<text x="40" y="50" fill="currentColor"><tspan style="fill:var(--md-muted)"></tspan><tspan font-weight="600">my_app/</tspan></text>
<text x="40" y="92" fill="currentColor"><tspan style="fill:var(--md-muted)">├── </tspan><tspan>main.py</tspan></text>
<text x="330" y="92" font-size="15" fill="#2dd4bf">your program</text>
<text x="40" y="134" fill="currentColor"><tspan style="fill:var(--md-muted)">└── </tspan><tspan font-weight="600">textkit/</tspan></text>
<text x="330" y="134" font-size="15" fill="#2dd4bf">a package: a folder</text>
<text x="84" y="176" fill="currentColor"><tspan style="fill:var(--md-muted)">├── </tspan><tspan>__init__.py</tspan></text>
<text x="330" y="176" font-size="15" fill="#2dd4bf">runs on first import</text>
<text x="84" y="218" fill="currentColor"><tspan style="fill:var(--md-muted)">├── </tspan><tspan>tools.py</tspan></text>
<text x="330" y="218" font-size="15" fill="#2dd4bf">a module</text>
<text x="84" y="260" fill="currentColor"><tspan style="fill:var(--md-muted)">├── </tspan><tspan>__pycache__/</tspan></text>
<text x="330" y="260" font-size="15" fill="#2dd4bf">Python's compiled cache</text>
<text x="84" y="302" fill="currentColor"><tspan style="fill:var(--md-muted)">└── </tspan><tspan font-weight="600">games/</tspan></text>
<text x="330" y="302" font-size="15" fill="#2dd4bf">a subpackage</text>
<text x="128" y="344" fill="currentColor"><tspan style="fill:var(--md-muted)">├── </tspan><tspan>__init__.py</tspan></text>
<text x="128" y="386" fill="currentColor"><tspan style="fill:var(--md-muted)">└── </tspan><tspan>dice.py</tspan></text>
<line x1="560" y1="20" x2="560" y2="420" stroke-width="1" style="stroke:var(--md-muted)"/>
<text x="595" y="60" fill="currentColor" font-weight="600">import textkit</text>
<text x="615" y="90" font-size="15" fill="#2dd4bf">→ runs textkit/__init__.py</text>
<text x="595" y="170" fill="currentColor" font-weight="600">from textkit.tools import shout</text>
<text x="615" y="200" font-size="15" fill="#2dd4bf">→ runs textkit/__init__.py</text>
<text x="615" y="226" font-size="15" fill="#2dd4bf">→ then textkit/tools.py</text>
<text x="595" y="300" fill="currentColor" font-weight="600">import textkit.games.dice</text>
<text x="615" y="330" font-size="15" fill="#2dd4bf">→ …then games/__init__.py</text>
<text x="615" y="356" font-size="15" fill="#2dd4bf">→ then games/dice.py</text>
<text x="595" y="420" font-size="16" style="fill:var(--md-accent)">textkit.games.dice = textkit/games/dice.py</text>
</svg>

<!-- notes -->
module = one .py file (week 2's text_tools.py). package = a folder of modules. A package can hold other packages (subpackages): games/ inside textkit/.
__init__.py marks the folder as a package and runs the first time anything in the package is imported. It's often empty; often it imports the package's most useful names so users can write textkit.shout instead of textkit.tools.shout.
The import path mirrors the folders: textkit.games.dice is textkit/games/dice.py. Importing a submodule runs every __init__.py on the way down, parents first.
Aside, relative imports: a LEADING dot means "this package", two dots its parent. Inside textkit/__init__.py: from .tools import shout. Inside games/dice.py: from ..tools import shout. They only work in files that are part of a package: running a script directly (python3 main.py) gives "ImportError: attempted relative import with no known parent package".
__pycache__/ holds compiled bytecode (.pyc) so the next import is faster. Safe to delete, never commit it. (Students saw one appear in week 2.)
Since Python 3.3, a folder without __init__.py can still be imported (a "namespace package"), but regular packages have one. Teach the regular kind.
Real example: rich/ is a package; rich/table.py is a module, which is why it's "from rich.table import Table".
