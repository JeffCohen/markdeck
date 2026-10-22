# Casting vs. Converting

<svg viewBox="0 0 1000 360" role="img" aria-label="Cast: the string object for 57 keeps its bytes 35 37 and only its type field changes to int, so it reads as 14133. Convert: int(s) leaves the string alone and parses its characters, 5 times 10 plus 7, into a brand-new int object holding 57." style="width:100%;height:auto;max-height:68vh;color:var(--md-fg);font-family:var(--md-font-mono);font-size:17px">
<text x="40" y="24" font-size="15" letter-spacing="2" fill="#2dd4bf">CAST  same object, new type label</text>
<text x="940" y="24" text-anchor="end" font-size="14" letter-spacing="2" style="fill:var(--md-muted)">1 BOX = 1 BYTE</text>
<text x="40" y="56" font-weight="600" fill="currentColor">str @ <tspan style="fill:var(--md-highlight)">0x2000</tspan></text>
<rect x="40" y="66" width="150" height="40" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="115" y="92" text-anchor="middle" font-size="15" fill="currentColor">type: str</text>
<rect x="190" y="66" width="36" height="40" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="208" y="92" text-anchor="middle" font-size="15" fill="currentColor">35</text>
<rect x="226" y="66" width="36" height="40" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="244" y="92" text-anchor="middle" font-size="15" fill="currentColor">37</text>
<text x="226" y="128" text-anchor="middle" font-size="14" style="fill:var(--md-muted)">"57"</text>
<line x1="280" y1="86" x2="372" y2="86" stroke="currentColor" stroke-width="2"/>
<polygon points="386,86 372,92 372,80" fill="currentColor"/>
<text x="332" y="74" text-anchor="middle" font-size="15" fill="currentColor">cast</text>
<text x="400" y="56" font-weight="600" fill="currentColor">int @ <tspan style="fill:var(--md-highlight)">0x2000</tspan></text>
<rect x="400" y="66" width="150" height="40" fill="none" stroke-width="2.5" style="stroke:var(--md-highlight)"/>
<text x="475" y="92" text-anchor="middle" font-size="15" style="fill:var(--md-highlight)">type: int</text>
<rect x="550" y="66" width="36" height="40" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="568" y="92" text-anchor="middle" font-size="15" fill="currentColor">35</text>
<rect x="586" y="66" width="36" height="40" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="604" y="92" text-anchor="middle" font-size="15" fill="currentColor">37</text>
<text x="650" y="92" font-size="19" style="fill:var(--md-highlight)">= 14133</text>
<text x="400" y="128" font-size="14" style="fill:var(--md-muted)">same address, same bytes: only the label changed</text>
<line x1="40" y1="165" x2="960" y2="165" stroke-width="1" style="stroke:var(--md-muted)"/>
<text x="40" y="200" font-size="15" letter-spacing="2" fill="#2dd4bf">CONVERT  n = int(s)  builds a new object</text>
<text x="40" y="236" font-weight="600" fill="currentColor">str @ <tspan style="fill:var(--md-highlight)">0x2000</tspan></text>
<rect x="40" y="246" width="150" height="40" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="115" y="272" text-anchor="middle" font-size="15" fill="currentColor">type: str</text>
<rect x="190" y="246" width="36" height="40" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="208" y="272" text-anchor="middle" font-size="15" fill="currentColor">35</text>
<rect x="226" y="246" width="36" height="40" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="244" y="272" text-anchor="middle" font-size="15" fill="currentColor">37</text>
<text x="151" y="308" text-anchor="middle" font-size="14" style="fill:var(--md-muted)">"57", left alone</text>
<line x1="280" y1="266" x2="372" y2="266" stroke-width="2" style="stroke:var(--md-accent)"/>
<polygon points="386,266 372,272 372,260" style="fill:var(--md-accent)"/>
<text x="332" y="254" text-anchor="middle" font-size="15" style="fill:var(--md-accent)">parse</text>
<text x="332" y="292" text-anchor="middle" font-size="14" style="fill:var(--md-accent)">5×10 + 7</text>
<text x="400" y="236" font-weight="600" fill="currentColor">int @ <tspan style="fill:var(--md-accent)">0x3000</tspan></text>
<rect x="400" y="246" width="150" height="40" fill="none" stroke-width="2.5" style="stroke:var(--md-accent)"/>
<text x="475" y="272" text-anchor="middle" font-size="15" fill="currentColor">type: int</text>
<rect x="550" y="246" width="36" height="40" fill="none" stroke-width="2.5" style="stroke:var(--md-accent)"/>
<text x="568" y="272" text-anchor="middle" font-size="15" fill="currentColor">39</text>
<rect x="586" y="246" width="36" height="40" fill="none" stroke-width="2.5" style="stroke:var(--md-accent)"/>
<text x="604" y="272" text-anchor="middle" font-size="15" fill="currentColor">00</text>
<text x="650" y="272" font-size="19" style="fill:var(--md-accent)">= 57</text>
<text x="400" y="308" font-size="14" style="fill:var(--md-muted)">a brand-new object, at a new address</text>
<text x="40" y="346" font-size="15" fill="currentColor">int(s)   float(s)   str(n)   list(s)   <tspan style="fill:var(--md-accent)">all convert: none of them cast</tspan></text>
</svg>

<!-- notes -->
Week 2's Inside Python Objects picture, simplified: every object starts with a field saying its type, then its data. Here the string "57" is two bytes, 35 and 37 in hex: the character codes for '5' and '7'.
A CAST, in the strict sense: keep the very same bytes and just read them as a different type. Relabel the str as an int and those two bytes mean 0x3735 = 14133 (on a little-endian machine, which stores the low byte first). Fast, and usually nonsense. C does this with pointer casts (*(int *)&x); Python won't do it to its built-in objects.
A CONVERSION: int(s) reads the characters, works out the number (5 × 10 + 7), and builds a NEW int object holding 57 (0x39). The string is untouched: id(s) and id(n) differ, and s is still "57".
So in Python, int(), float(), str(), list(), tuple(), set() are all conversions: each makes a new object from the old one. Calling them "casts" is common but loose (that question from week 3).
Conversions can fail, because not every string means a number: int("89%") can't be parsed. That's the next slide: it raises ValueError.
Nuance if asked: C's (int)3.7 is also really a conversion (it computes 3). The one true cast in Python is memoryview.cast, which reinterprets raw bytes, not objects.
