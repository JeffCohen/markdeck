# Axelrod's Tournament, 1980

<svg viewBox="0 0 1000 450" role="img" aria-label="Final ranking of the 15 programs in Axelrod's first tournament. The top 8 were all nice: they never kept first. Copycat, the simplest entry, was first; Grudger, which never forgives, was 7th. The bottom 7 all kept first, including a sneaky Copycat that keeps 10 percent of the time at random, in 12th, and Random in last place. What did well: nice, retaliatory, forgiving, clear." style="width:100%;height:auto;max-height:70vh;color:var(--md-fg);font-family:var(--md-font-mono);font-size:17px">
<text x="20" y="22" font-size="15" fill="#2dd4bf">FINAL RANKING, 15 PROGRAMS</text>
<g font-size="14" text-anchor="end" style="fill:var(--md-muted)">
<text x="44" y="56">1</text><text x="44" y="80">2</text><text x="44" y="104">3</text><text x="44" y="128">4</text><text x="44" y="152">5</text><text x="44" y="176">6</text><text x="44" y="200">7</text><text x="44" y="224">8</text>
<text x="44" y="262">9</text><text x="44" y="286">10</text><text x="44" y="310">11</text><text x="44" y="334">12</text><text x="44" y="358">13</text><text x="44" y="382">14</text><text x="44" y="406">15</text>
</g>
<g style="fill:var(--md-accent)" fill-opacity="0.75">
<rect x="56" y="42" width="300" height="18" rx="3"/><rect x="56" y="66" width="292" height="18" rx="3"/><rect x="56" y="90" width="288" height="18" rx="3"/><rect x="56" y="114" width="285" height="18" rx="3"/>
<rect x="56" y="138" width="282" height="18" rx="3"/><rect x="56" y="162" width="280" height="18" rx="3"/><rect x="56" y="186" width="275" height="18" rx="3"/><rect x="56" y="210" width="270" height="18" rx="3"/>
</g>
<g style="fill:var(--md-muted)" fill-opacity="0.75">
<rect x="56" y="248" width="236" height="18" rx="3"/><rect x="56" y="272" width="224" height="18" rx="3"/><rect x="56" y="296" width="216" height="18" rx="3"/><rect x="56" y="320" width="180" height="18" rx="3"/>
<rect x="56" y="344" width="175" height="18" rx="3"/><rect x="56" y="368" width="168" height="18" rx="3"/><rect x="56" y="392" width="160" height="18" rx="3"/>
</g>
<g font-size="15">
<text x="366" y="56" style="fill:var(--md-highlight)">Copycat: the shortest program</text>
<text x="344" y="200" fill="currentColor">Grudger: never forgives</text>
<text x="246" y="334" fill="currentColor">Copycat that keeps its coin 10% of the time</text>
<text x="226" y="406" fill="currentColor">Random</text>
</g>
<line x1="20" y1="238" x2="960" y2="238" stroke-width="1" stroke-dasharray="5 6" style="stroke:var(--md-muted)"/>
<text x="680" y="140" font-size="16" style="fill:var(--md-accent)">top 8: all NICE</text>
<text x="680" y="162" font-size="14" style="fill:var(--md-muted)">never the first to keep</text>
<text x="680" y="318" font-size="16" fill="currentColor">bottom 7: all keep first</text>
<g font-size="17">
<text x="20" y="440" fill="currentColor">What wins:  <tspan style="fill:var(--md-accent)">nice</tspan>  ·  <tspan style="fill:var(--md-accent)">retaliatory</tspan>  ·  <tspan style="fill:var(--md-accent)">forgiving</tspan>  ·  <tspan style="fill:var(--md-accent)">clear</tspan></text>
</g>
</svg>

<!-- notes -->
Save this for AFTER the class leaderboard: it's the reveal.
Robert Axelrod, a political scientist, ran this exact tournament in 1980. He invited game theorists, economists, psychologists, mathematicians, and computer scientists to submit programs. 14 entries plus a Random bot; every program played every other one, 200 rounds per match. (The formal name of the game is the Prisoner's Dilemma; same payoff structure as our coins.)
The winner was the simplest program submitted: Copycat, about four lines, from Anatol Rapoport. Experts with elaborate opponent-modeling statistics finished below it.
The striking pattern: the top 8 programs were all "nice" (never the first to keep), and the bottom 7 all kept first. Being nice alone separated the top half from the bottom half.
Grudger (here: Friedman's entry) was nice but never forgives: one keep, and it keeps forever. Middle of the pack, 7th: it locked itself into mutual punishment with bots that kept once by accident or by probing.
The sneaky Copycat (Joss's entry) copies, but slips in a keep 10% of the time to grab extra points. 12th: each sneaky keep set off long revenge cycles with retaliating bots, costing far more than it gained. Random came last.
Then Axelrod published the results and ran it again: 62 entrants, all knowing Copycat had won and trying to beat it. Copycat won again.
His four lessons (The Evolution of Cooperation, 1984): be NICE (don't keep first), RETALIATORY (respond to a keep right away, or you get exploited), FORGIVING (go back to cooperating once they do), and CLEAR (simple enough that others can figure out how to cooperate with you).
Caveat if your class leaderboard disagrees: the best strategy depends on who else is playing. In a room full of always-cooperators, a keeper can top a single tournament. Axelrod's later "ecological" simulations, where losing strategies die out each generation, showed exploiters eat their prey and then starve, while nice retaliators take over.
Bar lengths are illustrative (relative order is the real ranking; exact scores ran from about 505 down to 276).
