# The Biggest Earthquake

Every earthquake recorded worldwide this week, updated every minute:

```text
https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson
```

Print the biggest one:

```console
$ uv run quakes.py
Magnitude 7: 191 km ENE of Nagqu, China
2026-10-22 09:33:40.353000
```

<span class="muted">Starter: `04_web/quakes.py`. Explore the data before you write the code.</span>

<!-- notes -->
About 10 minutes, right after the weather.py demo, in the same 04_web/ uv project (requests is already added).
No key, and no rate-limit worry: it's a static file USGS regenerates every minute, so 40 students can fetch it at once.
The point is writing an API client with no scaffolding: fetch, then EXPLORE the JSON (print the keys, print one item) before writing the real code. That's the habit.
Where things are (don't show until they've looked): data["features"] is a list, one dict per earthquake. Each has "properties" with "mag", "place", "time", "url". Coordinates are in "geometry".
The time is milliseconds since 1970 (a Unix timestamp): datetime.fromtimestamp(ms / 1000), which is in the file's hint. They haven't seen datetime yet; the hint is enough.
One-line answer: max(data["features"], key=lambda q: q["properties"]["mag"]). That's lambda and key= from week 3, on real data.
Fast finishers: print the url field too, and open it: USGS has a page for every quake with a map.
Solution (instructor only): 04_quakes_solution.py.
