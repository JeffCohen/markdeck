# The Trust Game

<svg viewBox="0 0 1000 440" role="img" aria-label="Each round, you and the other player each choose at the same time: put a coin into the machine, or keep it. A coin you put in costs you 1 and gives the other player 3. Both put in: plus 2 each. Both keep: 0 each. If you put in and they keep, you lose 1 and they gain 3. Keeping is better for you whatever they do, yet both keeping leaves both worse off than both trusting." style="width:100%;height:auto;max-height:68vh;color:var(--md-fg);font-family:var(--md-font-mono);font-size:20px">
<rect x="20" y="70" width="96" height="90" rx="10" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="68" y="125" text-anchor="middle" font-size="24" font-weight="600" fill="currentColor">you</text>
<circle cx="146" cy="115" r="15" fill="none" stroke-width="2.5" style="stroke:var(--md-highlight)"/>
<text x="146" y="121" text-anchor="middle" font-size="15" style="fill:var(--md-highlight)">1</text>
<line x1="163" y1="115" x2="186" y2="115" stroke-width="2" stroke="currentColor"/><polygon points="198,115 186,121 186,109" fill="currentColor"/>
<rect x="200" y="65" width="100" height="100" rx="12" fill="none" stroke-width="2.5" style="stroke:var(--md-accent)"/>
<text x="250" y="110" text-anchor="middle" font-size="15" style="fill:var(--md-accent)">trust</text>
<text x="250" y="131" text-anchor="middle" font-size="15" style="fill:var(--md-accent)">machine</text>
<line x1="302" y1="115" x2="322" y2="115" stroke-width="2" stroke="currentColor"/><polygon points="334,115 322,121 322,109" fill="currentColor"/>
<g style="stroke:var(--md-highlight)" fill="none" stroke-width="2.5"><circle cx="352" cy="98" r="13"/><circle cx="352" cy="128" r="13"/><circle cx="377" cy="113" r="13"/></g>
<text x="362" y="170" text-anchor="middle" font-size="14" style="fill:var(--md-highlight)">they get 3</text>
<text x="20" y="232" font-size="19" fill="currentColor">Each round, both choose at once:</text>
<text x="20" y="266" font-size="19" style="fill:var(--md-accent)">put a coin in  <tspan fill="currentColor">or</tspan>  keep it?</text>
<text x="645" y="26" text-anchor="middle" font-size="15" fill="#2dd4bf">they put in</text>
<text x="845" y="26" text-anchor="middle" font-size="15" fill="#2dd4bf">they keep it</text>
<text x="436" y="96" font-size="14" fill="#2dd4bf">you put in</text>
<text x="436" y="192" font-size="14" fill="#2dd4bf">you keep it</text>
<rect x="545" y="40" width="200" height="96" rx="8" fill="none" stroke-width="2.5" style="stroke:var(--md-accent)"/>
<rect x="745" y="40" width="200" height="96" rx="8" fill="none" stroke="currentColor" stroke-width="2"/>
<rect x="545" y="136" width="200" height="96" rx="8" fill="none" stroke="currentColor" stroke-width="2"/>
<rect x="745" y="136" width="200" height="96" rx="8" fill="none" stroke-width="2" style="stroke:var(--md-muted)"/>
<text x="645" y="96" text-anchor="middle" font-size="20" style="fill:var(--md-accent)">+2 each</text>
<text x="845" y="80" text-anchor="middle" font-size="16" fill="currentColor">you: -1</text>
<text x="845" y="104" text-anchor="middle" font-size="16" style="fill:var(--md-highlight)">they: +3</text>
<text x="645" y="176" text-anchor="middle" font-size="16" style="fill:var(--md-highlight)">you: +3</text>
<text x="645" y="200" text-anchor="middle" font-size="16" fill="currentColor">they: -1</text>
<text x="845" y="192" text-anchor="middle" font-size="20" style="fill:var(--md-muted)">0 each</text>
<g font-size="19">
<text x="452" y="300" fill="currentColor"><tspan style="fill:var(--md-highlight)">1.</tspan> Whatever they do, keeping it pays more.</text>
<text x="452" y="340" fill="currentColor"><tspan style="fill:var(--md-highlight)">2.</tspan> Same for them.</text>
<text x="452" y="380" fill="currentColor"><tspan style="fill:var(--md-highlight)">3.</tspan> So both keep: 0 each,</text>
<text x="482" y="406" fill="currentColor">worse than if both had trusted.</text>
</g>
</svg>

<!-- notes -->
Framing from Nicky Case's interactive "The Evolution of Trust" (ncase.me/trust): worth showing after class. Game theorists call this the Prisoner's Dilemma (Flood and Dresher at RAND, 1950, with a story about two prisoners added by Albert Tucker); the coin version has exactly the same structure.
The setup to tell: you and a stranger stand on opposite sides of a machine. You can't see or talk to each other. Each of you has a coin. Put yours in and it vanishes, but the machine pays out 3 coins to the OTHER person. You both decide at the same moment: put your coin in, or keep it?
Both put in: you each pay 1 and get 3, +2 each. You keep yours while they put theirs in: you get their 3 for free (+3) and they're out a coin (-1). Neither trusts: nothing happens, 0 each.
The twist, for the lab: it's the SAME stranger, every day, for a few hundred days. And they remember what you did yesterday.
Walk through your choice: if they put in, keeping gets you +3 instead of +2. If they keep theirs, keeping gets you 0 instead of -1. Either way, keeping is better for you. They reason the same way.
The dilemma: two "smart" players both keep their coins and get nothing, when trusting each other would have given both +2. Individual sense, collective nonsense.
Real-world versions: arms races, price wars, doping in sports, climate agreements, group projects, roommates and the dishes.
What changes when it repeats? Play the same opponent 200 times, and remember what they did. Now keeping has a cost: they'll remember. That's the lab, and the tournament at the end of class.
Next slide: the same table as the bots see it. Put a coin in = "cooperate"; keep it = "keep".
