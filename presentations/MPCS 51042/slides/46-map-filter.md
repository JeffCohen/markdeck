# map and filter

<svg viewBox="0 0 1000 400" role="img" aria-label="Six words. map(str.upper, words) turns each of the six into its uppercase version. filter keeps only the three words longer than four letters: score, seven, years." style="width:100%;height:auto;max-height:66vh;color:var(--md-fg);font-family:var(--md-font-mono);font-size:19px">
<text x="20" y="30" font-size="16" fill="#2dd4bf">words</text>
<g fill="none" stroke="currentColor" stroke-width="1.6">
<rect x="20" y="44" width="110" height="44" rx="8"/><rect x="146" y="44" width="110" height="44" rx="8"/><rect x="272" y="44" width="110" height="44" rx="8"/>
<rect x="398" y="44" width="110" height="44" rx="8"/><rect x="524" y="44" width="110" height="44" rx="8"/><rect x="650" y="44" width="110" height="44" rx="8"/>
</g>
<g text-anchor="middle" fill="currentColor">
<text x="75" y="73">four</text><text x="201" y="73">score</text><text x="327" y="73">and</text>
<text x="453" y="73">seven</text><text x="579" y="73">years</text><text x="705" y="73">ago</text>
</g>
<text x="20" y="145" font-size="21" font-weight="600" style="fill:var(--md-accent)">map(str.upper, words)</text>
<text x="330" y="145" font-size="16" style="fill:var(--md-muted)">every item, transformed</text>
<g fill="none" stroke-width="1.6" style="stroke:var(--md-accent)">
<rect x="20" y="170" width="110" height="44" rx="8"/><rect x="146" y="170" width="110" height="44" rx="8"/><rect x="272" y="170" width="110" height="44" rx="8"/>
<rect x="398" y="170" width="110" height="44" rx="8"/><rect x="524" y="170" width="110" height="44" rx="8"/><rect x="650" y="170" width="110" height="44" rx="8"/>
</g>
<g text-anchor="middle" fill="currentColor">
<text x="75" y="199">FOUR</text><text x="201" y="199">SCORE</text><text x="327" y="199">AND</text>
<text x="453" y="199">SEVEN</text><text x="579" y="199">YEARS</text><text x="705" y="199">AGO</text>
</g>
<text x="20" y="290" font-size="21" font-weight="600" style="fill:var(--md-highlight)">filter(lambda w: len(w) &gt; 4, words)</text>
<text x="20" y="316" font-size="16" style="fill:var(--md-muted)">some items, unchanged</text>
<g fill="none" stroke-width="1.6" style="stroke:var(--md-highlight)">
<rect x="146" y="336" width="110" height="44" rx="8"/><rect x="398" y="336" width="110" height="44" rx="8"/><rect x="524" y="336" width="110" height="44" rx="8"/>
</g>
<g text-anchor="middle" fill="currentColor">
<text x="201" y="365">score</text><text x="453" y="365">seven</text><text x="579" y="365">years</text>
</g>
<text x="800" y="73" font-size="16" style="fill:var(--md-muted)">6 in</text>
<text x="800" y="199" font-size="16" style="fill:var(--md-accent)">6 out</text>
<text x="800" y="365" font-size="16" style="fill:var(--md-highlight)">3 out</text>
</svg>

<!-- notes -->
map(f, items): call f on every item. Same number out as in. Like [f(x) for x in items].
filter(test, items): keep each item where test(item) is True. The kept items are unchanged. Like [x for x in items if test(x)].
Both take a FUNCTION as their first argument: functions as values, from week 3.
Most Python programmers prefer the comprehension, especially when map/filter would need a lambda. map reads well when the function already has a name: map(int, line.split()).
Cliffhanger for the next slide: print(map(str.upper, words)) doesn't show a list. It shows <map object at 0x...>. Nothing has been uppercased yet.
Demo: 03_map_filter.ipynb.
