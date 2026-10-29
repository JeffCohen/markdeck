# Sharing a uv Project

<svg viewBox="0 0 1000 420" role="img" aria-label="Your project folder has weather.py, pyproject.toml, uv.lock, and .venv. You share everything except .venv. Your teammate's folder starts with the three shared files; uv sync rebuilds .venv from uv.lock, and uv run weather.py runs it with those exact packages." style="width:100%;height:auto;max-height:68vh;color:var(--md-fg);font-family:var(--md-font-mono);font-size:18px">
<rect x="20" y="40" width="300" height="250" rx="12" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="40" y="76" font-size="20" font-weight="600" fill="currentColor">your folder</text>
<line x1="38" y1="92" x2="302" y2="92" stroke-width="1" style="stroke:var(--md-muted)"/>
<text x="50" y="130" fill="currentColor">weather.py</text>
<text x="50" y="170" fill="currentColor">pyproject.toml</text>
<text x="50" y="210" fill="currentColor">uv.lock</text>
<text x="50" y="250" style="fill:var(--md-muted)">.venv/</text>
<text x="140" y="250" font-size="14" style="fill:var(--md-highlight)">not shared</text>
<line x1="328" y1="170" x2="586" y2="170" stroke-width="2.5" style="stroke:var(--md-accent)"/><polygon points="600,170 586,177 586,163" style="fill:var(--md-accent)"/>
<text x="464" y="156" text-anchor="middle" font-size="16" style="fill:var(--md-accent)">git, zip, Drive</text>
<text x="464" y="196" text-anchor="middle" font-size="14" style="fill:var(--md-muted)">3 small text files</text>
<rect x="604" y="40" width="376" height="250" rx="12" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="624" y="76" font-size="20" font-weight="600" fill="currentColor">teammate's folder</text>
<line x1="622" y1="92" x2="962" y2="92" stroke-width="1" style="stroke:var(--md-muted)"/>
<text x="634" y="130" fill="currentColor">weather.py</text>
<text x="634" y="170" fill="currentColor">pyproject.toml</text>
<text x="634" y="210" fill="currentColor">uv.lock</text>
<text x="619" y="250" style="fill:var(--md-accent)">+</text>
<text x="634" y="250" fill="currentColor">.venv/</text>
<text x="740" y="250" font-size="14" fill="#2dd4bf">rebuilt from uv.lock</text>
<rect x="604" y="320" width="376" height="80" rx="10" fill="none" stroke-width="2" style="stroke:var(--md-accent)"/>
<text x="624" y="352" style="fill:var(--md-accent)">$ uv sync</text>
<text x="624" y="384" style="fill:var(--md-accent)">$ uv run weather.py</text>
<text x="20" y="340" font-size="15" fill="#2dd4bf" style="white-space:pre">pyproject.toml  what you asked for: requests</text>
<text x="20" y="368" font-size="15" fill="#2dd4bf" style="white-space:pre">uv.lock         exactly what got installed</text>
<text x="20" y="396" font-size="15" fill="#2dd4bf" style="white-space:pre">.venv/          the packages themselves</text>
</svg>

<!-- notes -->
Follows Installing Packages (uv init --bare, uv add) and Single-File Scripts (PEP 723).
The three things a uv project leaves in the folder, and which ones travel: pyproject.toml is what you asked for ("requests>=2.32"); uv.lock is the exact versions that got installed, including requests' own dependencies; .venv/ is the installed packages themselves, often hundreds of files.
Share the small text files, never .venv/: it's big, and it's built for your OS and Python. uv sync reads uv.lock and rebuilds .venv/ to match exactly, so your teammate (or the grader, or you on another laptop) gets the same versions you tested with.
uv run does a sync for you before running, so in practice your teammate can skip straight to uv run weather.py. uv sync on its own is worth knowing for "get me set up" moments.
Ruby analogy, for me: uv sync = bundle install; uv run = bundle exec.
Demo: 04_web/. cd in, uv init --bare, uv add requests, uv run weather.py; then ls -a to show the three new things.
