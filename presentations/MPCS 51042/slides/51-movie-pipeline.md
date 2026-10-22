# Lab: A Movie Pipeline

<svg viewBox="0 0 1000 340" role="img" aria-label="movies.csv feeds load_movies, which yields one row at a time into map(clean), then a filter that keeps movies with a rating. Those three steps pass one movie at a time. The last step, group by decade, needs every movie before it can print the averages." style="width:100%;height:auto;max-height:62vh;color:var(--md-fg);font-family:var(--md-font-mono);font-size:18px">
<rect x="10" y="90" width="140" height="70" rx="10" fill="none" stroke-width="2" style="stroke:var(--md-muted)"/>
<text x="80" y="131" text-anchor="middle" fill="currentColor">movies.csv</text>
<g fill="none" stroke="currentColor" stroke-width="2">
<rect x="200" y="80" width="170" height="90" rx="10"/>
<rect x="420" y="80" width="170" height="90" rx="10"/>
<rect x="640" y="80" width="150" height="90" rx="10"/>
</g>
<text x="285" y="118" text-anchor="middle" fill="currentColor">load_movies</text>
<text x="285" y="146" text-anchor="middle" font-size="15" fill="#2dd4bf">yield a dict</text>
<text x="505" y="118" text-anchor="middle" fill="currentColor">map(clean)</text>
<text x="505" y="146" text-anchor="middle" font-size="15" fill="#2dd4bf">each movie</text>
<text x="715" y="118" text-anchor="middle" fill="currentColor">filter</text>
<text x="715" y="146" text-anchor="middle" font-size="15" fill="#2dd4bf">has a rating</text>
<rect x="840" y="70" width="150" height="110" rx="10" fill="none" stroke-width="2.5" style="stroke:var(--md-highlight)"/>
<text x="915" y="112" text-anchor="middle" fill="currentColor">group by</text>
<text x="915" y="136" text-anchor="middle" fill="currentColor">decade</text>
<text x="915" y="162" text-anchor="middle" font-size="15" style="fill:var(--md-highlight)">a plain loop</text>
<g stroke-width="2" style="stroke:var(--md-accent)">
<line x1="152" y1="125" x2="186" y2="125"/><line x1="372" y1="125" x2="406" y2="125"/><line x1="592" y1="125" x2="626" y2="125"/><line x1="792" y1="125" x2="826" y2="125"/>
</g>
<g style="fill:var(--md-accent)">
<polygon points="198,125 186,131 186,119"/><polygon points="418,125 406,131 406,119"/><polygon points="638,125 626,131 626,119"/><polygon points="838,125 826,131 826,119"/>
</g>
<path d="M200 210 H790" fill="none" stroke-width="1.5" style="stroke:var(--md-accent)"/>
<path d="M200 200 V220 M790 200 V220" stroke-width="1.5" style="stroke:var(--md-accent)"/>
<text x="495" y="248" text-anchor="middle" font-size="17" style="fill:var(--md-accent)">lazy: one movie at a time</text>
<path d="M840 210 H990" fill="none" stroke-width="1.5" style="stroke:var(--md-highlight)"/>
<path d="M840 200 V220 M990 200 V220" stroke-width="1.5" style="stroke:var(--md-highlight)"/>
<text x="915" y="248" text-anchor="middle" font-size="17" style="fill:var(--md-highlight)">needs them all</text>
<text x="915" y="300" text-anchor="middle" font-size="17" fill="currentColor">1990s: ?.?</text>
<text x="915" y="324" text-anchor="middle" font-size="17" fill="currentColor">2000s: ?.?</text>
</svg>

<!-- notes -->
Lab file: 05_movies.py, with movies.csv. In pairs: one types, one reads ahead and predicts; switch at Part 2.
movies.csv is real-world messy: four date styles (1999, July 1994, July 24 1998, 2001-12-19), three rating scales (8.7, 88, 89%), missing ratings, and genres with commas inside.
load_movies is done for them: a generator function that yields one dict per line. It uses next(f) to skip the header, and split(",", 3) so genres keeps its commas.
Part 1: parse_year, parse_rating (try/except for the empty rating), primary_genre, clean. Pure functions: clean returns a NEW dict. Checks print ok/WRONG.
Part 2: main(). map(clean, ...), then filter or a generator expression, then group, then print. Nothing is read from the file until the grouping loop starts pulling movies through.
The grouping step is the odd one out: it needs every movie before it can answer, and a plain for loop with a dict is the clearest way to write it. That's the wrap-up discussion.
Answer (instructor only, 05_movies_solution.py): 1970s 9.2 (1 movie), 1980s 8.5 (1), 1990s 8.6 (15), 2000s 8.6 (7), 2010s 7.7 (61), 2020s 7.5 (8). 2 movies have no rating. Ask: would you trust an average of one movie?
