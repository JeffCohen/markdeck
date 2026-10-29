# Lab: A Weather Pipeline

<svg viewBox="0 0 1000 390" role="img" aria-label="fetch_forecast gets JSON from open-meteo.com the first time and saves it to weather.json, reading that file on later runs, or a saved snapshot if the network fails. daily_rows yields one row per city per day. Three pipelines each use a fresh daily_rows: map to Celsius then group by city for averages; filter rain over 0 for the rainy days; max with a key for the warmest day." style="width:100%;height:auto;max-height:66vh;color:var(--md-fg);font-family:var(--md-font-mono);font-size:17px">
<rect x="10" y="20" width="180" height="56" rx="28" fill="none" stroke-width="2" style="stroke:var(--md-accent)"/>
<text x="100" y="54" text-anchor="middle" style="fill:var(--md-accent)">open-meteo.com</text>
<rect x="10" y="166" width="180" height="56" rx="8" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="100" y="200" text-anchor="middle" fill="currentColor">weather.json</text>
<rect x="10" y="306" width="180" height="56" rx="8" fill="none" stroke-width="1.6" stroke-dasharray="6 6" style="stroke:var(--md-muted)"/>
<text x="100" y="333" text-anchor="middle" font-size="15" style="fill:var(--md-muted)">snapshot</text>
<text x="100" y="352" text-anchor="middle" font-size="13" style="fill:var(--md-muted)">if offline</text>
<line x1="100" y1="78" x2="100" y2="152" stroke-width="2" style="stroke:var(--md-accent)"/><polygon points="100,164 94,152 106,152" style="fill:var(--md-accent)"/>
<text x="112" y="120" font-size="13" style="fill:var(--md-accent)">first run:</text>
<text x="112" y="137" font-size="13" style="fill:var(--md-accent)">download, save</text>
<g stroke-width="2" stroke="currentColor" fill="none"><path d="M192 194 H232"/><path d="M192 334 H212 V194"/></g>
<polygon points="244,194 232,200 232,188" fill="currentColor"/>
<rect x="246" y="160" width="170" height="68" rx="8" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="331" y="190" text-anchor="middle" fill="currentColor">fetch_forecast</text>
<text x="331" y="214" text-anchor="middle" font-size="14" fill="#2dd4bf">dicts and lists</text>
<line x1="418" y1="194" x2="446" y2="194" stroke-width="2" stroke="currentColor"/><polygon points="458,194 446,200 446,188" fill="currentColor"/>
<rect x="460" y="160" width="150" height="68" rx="8" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="535" y="190" text-anchor="middle" fill="currentColor">daily_rows</text>
<text x="535" y="214" text-anchor="middle" font-size="14" fill="#2dd4bf">yield a row</text>
<g fill="none" stroke-width="2" style="stroke:var(--md-accent)"><path d="M612 194 H630 V58 H648"/><path d="M612 194 H648"/><path d="M630 194 V330 H648"/></g>
<g style="fill:var(--md-accent)"><polygon points="660,58 648,64 648,52"/><polygon points="660,194 648,200 648,188"/><polygon points="660,330 648,336 648,324"/></g>
<text x="650" y="262" font-size="13" text-anchor="middle" style="fill:var(--md-accent)" transform="rotate(-90 650 262)">fresh each time</text>
<rect x="662" y="30" width="170" height="56" rx="8" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="747" y="63" text-anchor="middle" fill="currentColor">map(to_celsius)</text>
<rect x="862" y="30" width="128" height="56" rx="8" fill="none" stroke-width="2.5" style="stroke:var(--md-highlight)"/>
<text x="926" y="55" text-anchor="middle" font-size="15" fill="currentColor">group by</text>
<text x="926" y="74" text-anchor="middle" font-size="15" fill="currentColor">city</text>
<line x1="834" y1="58" x2="850" y2="58" stroke-width="2" stroke="currentColor"/><polygon points="860,58 850,63 850,53" fill="currentColor"/>
<text x="862" y="110" font-size="14" style="fill:var(--md-highlight)">a plain loop</text>
<text x="662" y="110" font-size="14" fill="#2dd4bf">1. average highs</text>
<rect x="662" y="166" width="170" height="56" rx="8" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="747" y="199" text-anchor="middle" fill="currentColor">rain &gt; 0</text>
<text x="662" y="246" font-size="14" fill="#2dd4bf">2. rainy days (filter)</text>
<rect x="662" y="302" width="170" height="56" rx="8" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="747" y="335" text-anchor="middle" fill="currentColor">max(key=...)</text>
<text x="662" y="382" font-size="14" fill="#2dd4bf">3. warmest day</text>
</svg>

<!-- notes -->
Lab file: 05_weather.py. In pairs: one types, one reads ahead and predicts; switch after each step.
Live data: a 7-day forecast for Chicago, London, Singapore, and Tokyo, from open-meteo.com (free, no key). One request covers all four cities.
fetch_forecast is done for them, and it's a tour of tonight: reading a URL with urllib.request.urlopen looks just like opening a file; json.load turns the JSON text into dicts and lists; try/except FileNotFoundError reads weather.json if it's already there; try/except URLError falls back to weather_snapshot.json if the network fails or the API refuses.
Why cache: 40 students on one campus network share the API's rate limit (about 600 calls a minute). With the cache, each student downloads once. Delete weather.json to download fresh data.
Step 1, daily_rows, is theirs: a generator function that zips the API's parallel lists into one dict per city per day. The model is people() in 04_lazy.ipynb section 5. A check fails if it returns a list instead of using yield.
Step 2: to_celsius (pure: returns a NEW dict). Step 3, main(): (a) map and a grouping loop, (b) filter or a generator expression for rain > 0, (c) max with key=.
The gotcha, on purpose: a generator is used up after one pass. Each part of main() calls daily_rows(data) again for a fresh one.
The URL is http, not https: many Mac Python installs from python.org can't verify https certificates until you run /Applications/Python 3.x/Install Certificates.command. If a student asks, that's the fix.
Answer depends on the live forecast. With the saved snapshot (Oct 22): Chicago 17.9, London 14.7, Singapore 31.2, Tokyo 18.7 °C average highs; warmest Singapore on 2026-10-23, 33.8 °C.
Next week: the same API with requests, the library most Python code uses for this.
