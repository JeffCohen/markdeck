# urllib vs. requests

<div class="cols">

### Week 4: `urllib` (built in)

<div class="code-sm">

```python
import json
import urllib.request

url = (URL + "?latitude=41.88"
             "&longitude=-87.63")

with urllib.request.urlopen(url) as r:
    data = json.load(r)
```

</div>

<!-- col -->

### `requests` (from PyPI)

<div class="code-sm">

```python
import requests

params = {"latitude": 41.88,
          "longitude": -87.63}

r = requests.get(URL, params=params)
r.raise_for_status()
data = r.json()
```

</div>

</div>

<!-- notes -->
Same request as last week's lab, two ways. Both end with data as plain dicts and lists.
requests is the most-downloaded third-party package on PyPI: most real Python code that talks to the web uses it. It isn't in the standard library, which is exactly why we needed a uv project.
params: a dict instead of hand-gluing ?a=1&b=2 onto the URL. requests builds the query string and escapes anything that needs it (spaces, commas, &).
raise_for_status(): an HTTP error (404 not found, 429 too many requests, 500 server error) becomes an exception. urllib raises those itself; requests waits for you to ask, so you can inspect the response first.
response.json(): the JSON decoding is built in.
https just works: requests brings its own certificates, so last week's "Install Certificates" problem on Mac doesn't happen.
Real code should also pass timeout=10 (both libraries), so a dead server can't hang the program; 04_web/weather.py does. Errors: catch requests.RequestException, the parent of all of requests' own exceptions (connection failed, timeout, bad status).
Demo: 04_web/weather.py.
