# Installing Packages

<svg viewBox="0 0 1000 480" role="img" aria-label="A folder with just hello.py; uv init --bare and uv add rich fetch rich from PyPI; afterward the folder also has pyproject.toml, uv.lock, and .venv holding rich and its three dependencies" style="width:100%;height:auto;max-height:68vh;color:var(--md-fg);font-family:var(--md-font-mono);font-size:17px">
<rect x="330" y="10" width="300" height="110" rx="12" fill="none" stroke-width="2" style="stroke:var(--md-accent)"/>
<text x="352" y="50" font-size="24" font-weight="600" fill="currentColor">PyPI</text>
<text x="352" y="74" font-size="15" fill="#2dd4bf">pypi.org</text>
<text x="352" y="102" font-size="15" fill="currentColor">rich, numpy, pytest, …</text>
<path d="M165 226 V65 H314" fill="none" stroke="currentColor" stroke-width="2"/><polygon points="328,65 314,71 314,59" fill="currentColor"/>
<text x="180" y="30" font-size="15" style="fill:var(--md-muted)">uv init --bare</text>
<text x="180" y="54" font-weight="600" style="fill:var(--md-accent)">uv add rich</text>
<rect x="40" y="230" width="250" height="150" rx="12" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="60" y="266" font-size="20" font-weight="600" fill="currentColor">my-project/</text>
<line x1="58" y1="284" x2="272" y2="284" stroke-width="1" style="stroke:var(--md-muted)"/>
<text x="68" y="336" fill="currentColor">hello.py</text>
<line x1="298" y1="305" x2="504" y2="305" stroke-width="2" stroke="currentColor"/><polygon points="518,305 504,311 504,299" fill="currentColor"/>
<rect x="520" y="170" width="440" height="290" rx="12" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="542" y="206" font-size="20" font-weight="600" fill="currentColor">my-project/</text>
<text x="940" y="206" text-anchor="end" font-size="15" style="fill:var(--md-accent)">+ new</text>
<line x1="540" y1="224" x2="940" y2="224" stroke-width="1" style="stroke:var(--md-muted)"/>
<text x="560" y="264" style="fill:var(--md-muted)">hello.py</text>
<text x="545" y="304" style="fill:var(--md-accent)">+</text>
<text x="560" y="304" fill="currentColor">pyproject.toml</text>
<text x="745" y="304" font-size="15" fill="#2dd4bf">you asked for: rich</text>
<text x="545" y="344" style="fill:var(--md-accent)">+</text>
<text x="560" y="344" fill="currentColor">uv.lock</text>
<text x="745" y="344" font-size="15" fill="#2dd4bf">exact: rich 15.0.0 + 3</text>
<text x="545" y="384" style="fill:var(--md-accent)">+</text>
<text x="560" y="384" fill="currentColor">.venv/</text>
<text x="745" y="384" font-size="15" fill="#2dd4bf">the installed packages</text>
<rect x="560" y="404" width="64" height="28" rx="5" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="568" y="423" font-size="15" fill="currentColor">rich/</text>
<rect x="633" y="404" width="130" height="28" rx="5" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="641" y="423" font-size="15" fill="currentColor">markdown_it/</text>
<rect x="772" y="404" width="73" height="28" rx="5" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="780" y="423" font-size="15" fill="currentColor">mdurl/</text>
<rect x="854" y="404" width="96" height="28" rx="5" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="860" y="423" font-size="15" fill="currentColor">pygments/</text>
</svg>

<!-- notes -->
Everything so far came with Python (the standard library). PyPI, the Python Package Index, is where everyone else shares code: hundreds of thousands of packages.
Start: a folder with just hello.py. Run both commands from inside that folder.
uv init --bare makes pyproject.toml, which turns the folder into a uv project. Without it, uv add fails: "No pyproject.toml found". (Plain uv init also adds main.py, README.md, .python-version, .gitignore, and a git repo; --bare skips all that.)
uv add rich then fetches from PyPI and leaves the folder as on the right: + marks what's new. pyproject.toml now lists rich.
uv add rich does three things: downloads rich AND what rich depends on (markdown-it-py, mdurl, pygments: 4 packages in all), installs them into .venv/, and records them.
pyproject.toml = what you asked for ("rich>=15.0.0"). uv.lock = the exact versions that got installed, so everyone gets the same ones. Commit both; never commit .venv/ (uv sync rebuilds it).
.venv/ is a virtual environment: this project's private folder of packages. Two projects can need different versions of the same package without fighting.
import rich: Python searches a list of folders (sys.path); uv run puts .venv's packages on that list. That's why plain python3 can't find rich.
Gotcha: the name you install isn't always the name you import. markdown-it-py imports as markdown_it; Pillow as PIL; beautifulsoup4 as bs4.
Ruby analogy, for me: PyPI = rubygems.org, pyproject.toml = Gemfile, uv.lock = Gemfile.lock, uv sync = bundle install, uv add = bundle add, uv run = bundle exec, .python-version = .ruby-version, uvx = gem exec. Big difference: Ruby keeps many versions of a gem side by side and Bundler picks at load time; Python can only have one version per environment, hence one .venv per project.
