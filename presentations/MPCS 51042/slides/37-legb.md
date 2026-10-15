# Scope: Where Python Looks

<svg viewBox="0 0 1000 440" role="img" aria-label="Three nested scopes: Built-in contains Global contains Local. Python looks for a name from the inside out and stops at the first match. Beside it, assigning list shadows the built-in list." style="width:100%;height:auto;max-height:68vh;color:var(--md-fg);font-family:var(--md-font-mono);font-size:17px">
<rect x="40" y="40" width="560" height="380" rx="12" fill="none" stroke-width="1.5" stroke="currentColor"/>
<text x="56" y="68" font-size="17" font-weight="600" fill="currentColor">Built-in</text>
<text x="154.0" y="68" font-size="14" fill="#2dd4bf">len  print  list  range  …</text>
<rect x="75" y="110" width="490" height="290" rx="12" fill="none" stroke-width="1.5" stroke="currentColor"/>
<text x="91" y="138" font-size="17" font-weight="600" fill="currentColor">Global</text>
<text x="168.0" y="138" font-size="14" fill="#2dd4bf">this module's names</text>
<rect x="110" y="180" width="420" height="200" rx="12" fill="none" stroke-width="1.5" style="stroke:var(--md-accent)"/>
<text x="126" y="208" font-size="17" font-weight="600" fill="currentColor">Local</text>
<text x="192.5" y="208" font-size="14" fill="#2dd4bf">this call's names</text>
<text x="140" y="270" font-size="16" fill="currentColor">look for a name here first,</text>
<text x="140" y="296" font-size="16" fill="currentColor">then outward: stop at the</text>
<text x="140" y="322" font-size="16" font-weight="700" fill="currentColor">FIRST match</text>
<line x1="470" y1="300" x2="470" y2="52" stroke-width="2.5" style="stroke:var(--md-highlight)"/><polygon points="470,40 475,52 465,52" style="fill:var(--md-highlight)"/>
<text x="650" y="70" font-size="18" font-weight="600" fill="currentColor">Shadowing</text>
<text x="650" y="110" fill="currentColor">list = [1, 2]</text>
<text x="650" y="140" fill="currentColor">list("abc")</text>
<text x="650" y="180" font-size="15" fill="#f87171">TypeError:</text>
<text x="650" y="202" font-size="15" fill="#f87171">'list' object is</text>
<text x="650" y="224" font-size="15" fill="#f87171">not callable</text>
</svg>

<!-- notes -->
To find a name, Python checks the Local namespace (this call's frame), then the Global namespace (this module), then Built-ins (len, print, list, sum...). First match wins; no match anywhere is a NameError.
That's how add_up (previous slide) finds sum: not local, not in the module, so Built-in.
Shadowing: list = [1, 2] puts list in the global namespace, so the built-in list is never reached. Fix: del list (the built-in is visible again) or, better, pick another name.
Same rule as the import slide: first match on sys.path wins, so a file named random.py in your folder hides the real random module.
The full rule is called LEGB: there's an Enclosing level between Local and Global, for a def written inside another def. We'll add it with closures and decorators.
If asked: Python's scope is LEXICAL (static): the chain depends on where a function is WRITTEN, not who called it. That's why add_up can't see average's names. The alternative, DYNAMIC scope (a function sees its caller's variables), is how Bash and early Lisps work. Also a closures topic.
Built-ins are just another namespace: import builtins; dir(builtins).
