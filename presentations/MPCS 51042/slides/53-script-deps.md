# Single-File Scripts

<div class="cols">

```python
# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "rich",
# ]
# ///
from rich import print

print("[yellow]Hello[/], world!")
```

<!-- col -->

```console
$ uv add --script hello.py rich

$ uv run hello.py
```
<span class="text-yellow-400">Hello</span>, world!

</div>

<!-- notes -->
Same goal as the last slide, no project: the dependency list lives in a comment block at the top of the file. This is PEP 723, "inline script metadata" (peps.python.org/pep-0723). Good moment to show peps.python.org: PEPs are how Python itself changes. Others worth knowing: PEP 8 (style), PEP 20 (import this), PEP 257 (docstrings).
uv add --script hello.py rich writes the header for you; you can also type it by hand. uv run reads it, builds a throwaway environment in uv's cache, and runs the file. ls shows the point: no pyproject.toml, no uv.lock, no .venv/ in the folder.
To Python itself the header is just comments: python3 hello.py ignores it and fails with ModuleNotFoundError. It only works through a tool that reads PEP 723 (uv, pipx, hatch).
11_breakout.py uses this: that's why uv run 11_breakout.py just worked.
When to use which: one file you hand to someone (a demo, a utility, a homework starter) → inline header. A folder of files, tests, tool config, something you'd publish → uv init and pyproject.toml.
"rich" with no version takes the newest. To pin: "rich>=15,<16", or uv lock --script hello.py writes hello.py.lock next to it.
