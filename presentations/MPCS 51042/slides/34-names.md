# Names Are Labels

<svg viewBox="0 0 1000 430" role="img" aria-label="Six statements that each bind a name to an object: assignment, def, import, for, class, and a function parameter" style="width:100%;height:auto;max-height:68vh;color:var(--md-fg);font-family:var(--md-font-mono);font-size:17px">
<text x="40" y="24" font-size="14" fill="#2dd4bf">STATEMENT</text>
<text x="640" y="24" font-size="14" fill="#2dd4bf">OBJECT</text>
<text x="40" y="70" fill="currentColor"><tspan font-weight="700" style="fill:var(--md-accent)">x</tspan> = 1000</text>
<line x1="470" y1="64" x2="618" y2="64" stroke-width="2" stroke="currentColor"/><polygon points="630,64 618,69 618,59" fill="currentColor"/>
<rect x="640" y="40" width="300" height="40" rx="8" fill="none" stroke-width="1.5" stroke="currentColor"/>
<text x="656" y="66" fill="currentColor">int 1000</text>
<text x="40" y="132" fill="currentColor">def <tspan font-weight="700" style="fill:var(--md-accent)">shout</tspan>(text): ...</text>
<line x1="470" y1="126" x2="618" y2="126" stroke-width="2" stroke="currentColor"/><polygon points="630,126 618,131 618,121" fill="currentColor"/>
<rect x="640" y="102" width="300" height="40" rx="8" fill="none" stroke-width="1.5" stroke="currentColor"/>
<text x="656" y="128" fill="currentColor">function</text>
<text x="40" y="194" fill="currentColor">import <tspan font-weight="700" style="fill:var(--md-accent)">textkit</tspan></text>
<line x1="470" y1="188" x2="618" y2="188" stroke-width="2" stroke="currentColor"/><polygon points="630,188 618,193 618,183" fill="currentColor"/>
<rect x="640" y="164" width="300" height="40" rx="8" fill="none" stroke-width="1.5" stroke="currentColor"/>
<text x="656" y="190" fill="currentColor">module</text>
<text x="40" y="256" fill="currentColor">for <tspan font-weight="700" style="fill:var(--md-accent)">word</tspan> in words: ...</text>
<line x1="470" y1="250" x2="618" y2="250" stroke-width="2" stroke="currentColor"/><polygon points="630,250 618,255 618,245" fill="currentColor"/>
<rect x="640" y="226" width="300" height="40" rx="8" fill="none" stroke-width="1.5" stroke="currentColor"/>
<text x="656" y="252" fill="currentColor">str, one at a time</text>
<text x="40" y="318" fill="currentColor">class <tspan font-weight="700" style="fill:var(--md-accent)">Movie</tspan>: ...</text>
<line x1="470" y1="312" x2="618" y2="312" stroke-width="2" stroke="currentColor"/><polygon points="630,312 618,317 618,307" fill="currentColor"/>
<rect x="640" y="288" width="300" height="40" rx="8" fill="none" stroke-width="1.5" stroke="currentColor"/>
<text x="656" y="314" fill="currentColor">class</text>
<text x="40" y="380" fill="currentColor">shout("hi")</text>
<text x="40" y="402" font-size="14" fill="#2dd4bf">binds the parameter <tspan font-weight="700" style="fill:var(--md-accent)">text</tspan></text>
<line x1="470" y1="374" x2="618" y2="374" stroke-width="2" stroke="currentColor"/><polygon points="630,374 618,379 618,369" fill="currentColor"/>
<rect x="640" y="350" width="300" height="40" rx="8" fill="none" stroke-width="1.5" stroke="currentColor"/>
<text x="656" y="376" fill="currentColor">str "hi"</text>
</svg>

<!-- notes -->
Every one of these statements does the same thing: it binds a NAME to an OBJECT. We've seen x = 1000 since week 1; def, import, for, class, and calling a function are all assignments in disguise.
def shout(...) creates a function object and binds the name shout to it. import textkit creates (or reuses) a module object and binds textkit. A for loop rebinds word on every pass. Calling shout("hi") binds the parameter text to the str "hi" inside the call.
Same picture as Inside Python Objects: names point at objects on the heap. The rest of this sequence answers: WHERE do the names live?
