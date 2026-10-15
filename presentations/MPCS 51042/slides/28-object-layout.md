# Inside Python Objects

<svg viewBox="0 0 1000 470" role="img" aria-label="x = 1000, s = hi!, and pair = (x, s) in memory, one box per byte: each object is a run of neighboring bytes grouped into fields; the tuple's slots hold the addresses of the int and the string" style="width:100%;height:auto;max-height:68vh;color:var(--md-fg);font-family:var(--md-font-mono);font-size:17px">
<g fill="currentColor" font-size="19"><text x="40" y="26">x = 1000</text><text x="40" y="54">s = "hi!"</text><text x="40" y="82">pair = (x, s)</text></g>
<text x="940" y="26" text-anchor="end" font-size="14" letter-spacing="2" style="fill:var(--md-muted)">1 BOX = 1 BYTE</text>
<rect x="40" y="96" width="76" height="30" rx="6" fill="none" stroke-width="2" style="stroke:var(--md-accent)"/>
<text x="78" y="117" text-anchor="middle" font-weight="600" fill="currentColor">x</text>
<line x1="78" y1="126" x2="78" y2="131" stroke="currentColor" stroke-width="2"/>
<polygon points="72,130 84,130 78,140" fill="currentColor"/>
<text x="134" y="117" font-weight="600" fill="currentColor">int @ <tspan style="fill:var(--md-accent)">0x1000</tspan></text>
<rect x="40" y="140" width="36" height="40" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="58.0" y="166" text-anchor="middle" font-size="15" fill="currentColor">00</text>
<rect x="76" y="140" width="36" height="40" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="94.0" y="166" text-anchor="middle" font-size="15" fill="currentColor">9a</text>
<rect x="112" y="140" width="36" height="40" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="130.0" y="166" text-anchor="middle" font-size="15" fill="currentColor">00</text>
<rect x="148" y="140" width="36" height="40" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="166.0" y="166" text-anchor="middle" font-size="15" fill="currentColor">00</text>
<rect x="184" y="140" width="36" height="40" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="202.0" y="166" text-anchor="middle" font-size="15" fill="currentColor">00</text>
<rect x="220" y="140" width="36" height="40" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="238.0" y="166" text-anchor="middle" font-size="15" fill="currentColor">00</text>
<rect x="256" y="140" width="36" height="40" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="274.0" y="166" text-anchor="middle" font-size="15" fill="currentColor">00</text>
<rect x="292" y="140" width="36" height="40" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="310.0" y="166" text-anchor="middle" font-size="15" fill="currentColor">00</text>
<polyline points="43,184 43,188 325,188 325,184" fill="none" stroke-width="1.5" style="stroke:var(--md-muted)"/>
<text x="43" y="207" font-size="14"><tspan fill="#2dd4bf">0x1000</tspan><tspan dx="8" fill="currentColor">type: int</tspan></text>
<rect x="328" y="140" width="36" height="40" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="346.0" y="166" text-anchor="middle" font-size="15" fill="currentColor">e8</text>
<rect x="364" y="140" width="36" height="40" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="382.0" y="166" text-anchor="middle" font-size="15" fill="currentColor">03</text>
<rect x="400" y="140" width="36" height="40" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="418.0" y="166" text-anchor="middle" font-size="15" fill="currentColor">00</text>
<rect x="436" y="140" width="36" height="40" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="454.0" y="166" text-anchor="middle" font-size="15" fill="currentColor">00</text>
<polyline points="331,184 331,188 469,188 469,184" fill="none" stroke-width="1.5" style="stroke:var(--md-muted)"/>
<text x="331" y="207" font-size="14"><tspan fill="#2dd4bf">0x1008</tspan><tspan dx="8" fill="currentColor">1000</tspan></text>
<rect x="40" y="218" width="76" height="30" rx="6" fill="none" stroke-width="2" style="stroke:var(--md-accent)"/>
<text x="78" y="239" text-anchor="middle" font-weight="600" fill="currentColor">s</text>
<line x1="78" y1="248" x2="78" y2="253" stroke="currentColor" stroke-width="2"/>
<polygon points="72,252 84,252 78,262" fill="currentColor"/>
<text x="134" y="239" font-weight="600" fill="currentColor">str @ <tspan style="fill:var(--md-highlight)">0x2000</tspan></text>
<rect x="40" y="262" width="36" height="40" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="58.0" y="288" text-anchor="middle" font-size="15" fill="currentColor">00</text>
<rect x="76" y="262" width="36" height="40" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="94.0" y="288" text-anchor="middle" font-size="15" fill="currentColor">9b</text>
<rect x="112" y="262" width="36" height="40" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="130.0" y="288" text-anchor="middle" font-size="15" fill="currentColor">00</text>
<rect x="148" y="262" width="36" height="40" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="166.0" y="288" text-anchor="middle" font-size="15" fill="currentColor">00</text>
<rect x="184" y="262" width="36" height="40" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="202.0" y="288" text-anchor="middle" font-size="15" fill="currentColor">00</text>
<rect x="220" y="262" width="36" height="40" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="238.0" y="288" text-anchor="middle" font-size="15" fill="currentColor">00</text>
<rect x="256" y="262" width="36" height="40" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="274.0" y="288" text-anchor="middle" font-size="15" fill="currentColor">00</text>
<rect x="292" y="262" width="36" height="40" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="310.0" y="288" text-anchor="middle" font-size="15" fill="currentColor">00</text>
<polyline points="43,306 43,310 325,310 325,306" fill="none" stroke-width="1.5" style="stroke:var(--md-muted)"/>
<text x="43" y="329" font-size="14"><tspan fill="#2dd4bf">0x2000</tspan><tspan dx="8" fill="currentColor">type: str</tspan></text>
<rect x="328" y="262" width="36" height="40" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="346.0" y="288" text-anchor="middle" font-size="15" fill="currentColor">68</text>
<rect x="364" y="262" width="36" height="40" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="382.0" y="288" text-anchor="middle" font-size="15" fill="currentColor">69</text>
<rect x="400" y="262" width="36" height="40" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="418.0" y="288" text-anchor="middle" font-size="15" fill="currentColor">21</text>
<rect x="436" y="262" width="36" height="40" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="454.0" y="288" text-anchor="middle" font-size="15" fill="currentColor">00</text>
<polyline points="331,306 331,310 469,310 469,306" fill="none" stroke-width="1.5" style="stroke:var(--md-muted)"/>
<text x="331" y="329" font-size="14"><tspan fill="#2dd4bf">0x2008</tspan><tspan dx="8" fill="currentColor">"hi!"</tspan></text>
<rect x="40" y="340" width="76" height="30" rx="6" fill="none" stroke-width="2" style="stroke:var(--md-accent)"/>
<text x="78" y="361" text-anchor="middle" font-weight="600" fill="currentColor">pair</text>
<line x1="78" y1="370" x2="78" y2="375" stroke="currentColor" stroke-width="2"/>
<polygon points="72,374 84,374 78,384" fill="currentColor"/>
<text x="134" y="361" font-weight="600" fill="currentColor">tuple @ 0x3000</text>
<rect x="40" y="384" width="36" height="40" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="58.0" y="410" text-anchor="middle" font-size="15" fill="currentColor">00</text>
<rect x="76" y="384" width="36" height="40" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="94.0" y="410" text-anchor="middle" font-size="15" fill="currentColor">9c</text>
<rect x="112" y="384" width="36" height="40" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="130.0" y="410" text-anchor="middle" font-size="15" fill="currentColor">00</text>
<rect x="148" y="384" width="36" height="40" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="166.0" y="410" text-anchor="middle" font-size="15" fill="currentColor">00</text>
<rect x="184" y="384" width="36" height="40" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="202.0" y="410" text-anchor="middle" font-size="15" fill="currentColor">00</text>
<rect x="220" y="384" width="36" height="40" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="238.0" y="410" text-anchor="middle" font-size="15" fill="currentColor">00</text>
<rect x="256" y="384" width="36" height="40" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="274.0" y="410" text-anchor="middle" font-size="15" fill="currentColor">00</text>
<rect x="292" y="384" width="36" height="40" fill="none" stroke="currentColor" stroke-width="1.2"/>
<text x="310.0" y="410" text-anchor="middle" font-size="15" fill="currentColor">00</text>
<polyline points="43,428 43,432 325,432 325,428" fill="none" stroke-width="1.5" style="stroke:var(--md-muted)"/>
<text x="43" y="451" font-size="14"><tspan fill="#2dd4bf">0x3000</tspan><tspan dx="8" fill="currentColor">type: tuple</tspan></text>
<rect x="328" y="384" width="36" height="40" style="fill:var(--md-accent)" fill-opacity="0.2" stroke="currentColor" stroke-width="1.2"/>
<text x="346.0" y="410" text-anchor="middle" font-size="15" fill="currentColor">00</text>
<rect x="364" y="384" width="36" height="40" style="fill:var(--md-accent)" fill-opacity="0.2" stroke="currentColor" stroke-width="1.2"/>
<text x="382.0" y="410" text-anchor="middle" font-size="15" fill="currentColor">10</text>
<rect x="400" y="384" width="36" height="40" style="fill:var(--md-accent)" fill-opacity="0.2" stroke="currentColor" stroke-width="1.2"/>
<text x="418.0" y="410" text-anchor="middle" font-size="15" fill="currentColor">00</text>
<rect x="436" y="384" width="36" height="40" style="fill:var(--md-accent)" fill-opacity="0.2" stroke="currentColor" stroke-width="1.2"/>
<text x="454.0" y="410" text-anchor="middle" font-size="15" fill="currentColor">00</text>
<rect x="472" y="384" width="36" height="40" style="fill:var(--md-accent)" fill-opacity="0.2" stroke="currentColor" stroke-width="1.2"/>
<text x="490.0" y="410" text-anchor="middle" font-size="15" fill="currentColor">00</text>
<rect x="508" y="384" width="36" height="40" style="fill:var(--md-accent)" fill-opacity="0.2" stroke="currentColor" stroke-width="1.2"/>
<text x="526.0" y="410" text-anchor="middle" font-size="15" fill="currentColor">00</text>
<rect x="544" y="384" width="36" height="40" style="fill:var(--md-accent)" fill-opacity="0.2" stroke="currentColor" stroke-width="1.2"/>
<text x="562.0" y="410" text-anchor="middle" font-size="15" fill="currentColor">00</text>
<rect x="580" y="384" width="36" height="40" style="fill:var(--md-accent)" fill-opacity="0.2" stroke="currentColor" stroke-width="1.2"/>
<text x="598.0" y="410" text-anchor="middle" font-size="15" fill="currentColor">00</text>
<polyline points="331,428 331,432 613,432 613,428" fill="none" stroke-width="1.5" style="stroke:var(--md-muted)"/>
<text x="331" y="451" font-size="14"><tspan fill="#2dd4bf">0x3008</tspan><tspan dx="8" style="fill:var(--md-accent)">→ 0x1000</tspan></text>
<rect x="616" y="384" width="36" height="40" style="fill:var(--md-highlight)" fill-opacity="0.2" stroke="currentColor" stroke-width="1.2"/>
<text x="634.0" y="410" text-anchor="middle" font-size="15" fill="currentColor">00</text>
<rect x="652" y="384" width="36" height="40" style="fill:var(--md-highlight)" fill-opacity="0.2" stroke="currentColor" stroke-width="1.2"/>
<text x="670.0" y="410" text-anchor="middle" font-size="15" fill="currentColor">20</text>
<rect x="688" y="384" width="36" height="40" style="fill:var(--md-highlight)" fill-opacity="0.2" stroke="currentColor" stroke-width="1.2"/>
<text x="706.0" y="410" text-anchor="middle" font-size="15" fill="currentColor">00</text>
<rect x="724" y="384" width="36" height="40" style="fill:var(--md-highlight)" fill-opacity="0.2" stroke="currentColor" stroke-width="1.2"/>
<text x="742.0" y="410" text-anchor="middle" font-size="15" fill="currentColor">00</text>
<rect x="760" y="384" width="36" height="40" style="fill:var(--md-highlight)" fill-opacity="0.2" stroke="currentColor" stroke-width="1.2"/>
<text x="778.0" y="410" text-anchor="middle" font-size="15" fill="currentColor">00</text>
<rect x="796" y="384" width="36" height="40" style="fill:var(--md-highlight)" fill-opacity="0.2" stroke="currentColor" stroke-width="1.2"/>
<text x="814.0" y="410" text-anchor="middle" font-size="15" fill="currentColor">00</text>
<rect x="832" y="384" width="36" height="40" style="fill:var(--md-highlight)" fill-opacity="0.2" stroke="currentColor" stroke-width="1.2"/>
<text x="850.0" y="410" text-anchor="middle" font-size="15" fill="currentColor">00</text>
<rect x="868" y="384" width="36" height="40" style="fill:var(--md-highlight)" fill-opacity="0.2" stroke="currentColor" stroke-width="1.2"/>
<text x="886.0" y="410" text-anchor="middle" font-size="15" fill="currentColor">00</text>
<polyline points="619,428 619,432 901,432 901,428" fill="none" stroke-width="1.5" style="stroke:var(--md-muted)"/>
<text x="619" y="451" font-size="14"><tspan fill="#2dd4bf">0x3010</tspan><tspan dx="8" style="fill:var(--md-highlight)">→ 0x2000</tspan></text>
</svg>

<!-- notes -->
One box per byte. An object is a run of neighboring bytes; the bytes are grouped into fields, and the object's address is where its run starts (that's what id() returns).
The first 8 bytes of every object say what KIND of object it is: the address of its type (int, str, tuple), which are objects too. That's how Python knows how to read the rest. Agreement in advance (week 1's Abstractions slide), stored right in memory.
The bytes look backwards because this machine is little-endian (smallest byte first): e8 03 00 00 is 0x000003e8 = 1000, and 00 10 00 ... is 0x1000.
str: 68 69 21 = "h", "i", "!" in ASCII, followed by a zero byte.
tuple: its slots don't hold 1000 or "hi!"; they hold the ADDRESSES of those objects (colors match). A list works the same way. HW1 Stretch #3.
Simplified: addresses are made up (real ones look like 0x100995f90), and real objects carry more bookkeeping (a reference count, the string's length and hash).
