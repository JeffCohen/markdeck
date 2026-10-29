# Special Methods

<svg viewBox="0 0 1000 440" role="img" aria-label="Python syntax on the left turns into special method calls on the right: len(x) calls x.__len__(), x[i] calls x.__getitem__(i), item in x calls x.__contains__(item), a + b calls a.__add__(b), a == b calls a.__eq__(b), a < b calls a.__lt__(b), and print(x) calls x.__repr__()." style="width:100%;height:auto;max-height:68vh;color:var(--md-fg);font-family:var(--md-font-mono);font-size:22px">
<text x="80" y="28" font-size="16" fill="#2dd4bf">YOU WRITE</text>
<text x="560" y="28" font-size="16" fill="#2dd4bf">PYTHON CALLS</text>
<g style="fill:var(--md-accent)">
<text x="80" y="80">len(x)</text>
<text x="80" y="134">x[i]</text>
<text x="80" y="188">item in x</text>
<text x="80" y="256">a + b</text>
<text x="80" y="310">a == b</text>
<text x="80" y="364">a &lt; b</text>
<text x="80" y="420">print(x)</text>
</g>
<g fill="currentColor">
<text x="560" y="80">x.__len__()</text>
<text x="560" y="134">x.__getitem__(i)</text>
<text x="560" y="188">x.__contains__(item)</text>
<text x="560" y="256">a.__add__(b)</text>
<text x="560" y="310">a.__eq__(b)</text>
<text x="560" y="364">a.__lt__(b)</text>
<text x="560" y="420">x.__repr__()</text>
</g>
<g stroke-width="1.8" style="stroke:var(--md-muted)">
<line x1="330" y1="73" x2="530" y2="73"/><line x1="330" y1="127" x2="530" y2="127"/><line x1="330" y1="181" x2="530" y2="181"/>
<line x1="330" y1="249" x2="530" y2="249"/><line x1="330" y1="303" x2="530" y2="303"/><line x1="330" y1="357" x2="530" y2="357"/><line x1="330" y1="413" x2="530" y2="413"/>
</g>
<g style="fill:var(--md-muted)">
<polygon points="542,73 530,79 530,67"/><polygon points="542,127 530,133 530,121"/><polygon points="542,181 530,187 530,175"/>
<polygon points="542,249 530,255 530,243"/><polygon points="542,303 530,309 530,297"/><polygon points="542,357 530,363 530,351"/><polygon points="542,413 530,419 530,407"/>
</g>
<text x="930" y="134" text-anchor="end" font-size="14" style="fill:var(--md-highlight)">MyList, week 3</text>
<text x="930" y="80" text-anchor="end" font-size="14" style="fill:var(--md-highlight)">MyList, week 3</text>
<text x="930" y="364" text-anchor="end" font-size="14" fill="#2dd4bf">sorted, max, min</text>
<text x="930" y="256" text-anchor="end" font-size="14" fill="#2dd4bf">sum</text>
<line x1="80" y1="218" x2="930" y2="218" stroke-width="1" stroke-dasharray="4 6" style="stroke:var(--md-muted)"/>
</svg>

<!-- notes -->
Python's syntax is a front for method calls. len(x) is really x.__len__(). Define the method, and the syntax works on your own objects.
"Special methods", "magic methods", or "dunder methods" (double underscore): all the same thing. You never call them directly; Python does, when you use the syntax.
They've done this already: MyList had __len__ and __getitem__ in week 3. That's why len(x) and x[0] worked.
Above the dashed line: making an object act like a container. Below: like a value.
Built-ins lean on these too: sorted(), max(), and min() only ask <, so __lt__ is enough to sort your objects. sum() uses +, but starts from 0, and 0 + your_object fails: give it a start value, sum(items, Duration(0)). The notebook shows that error on purpose.
Defaults if you don't define them: == means "same object" (is), < raises TypeError, print shows <__main__.Duration object at 0x...>.
__repr__ vs __str__ (if asked): print uses __str__ if there is one, else __repr__. Define __repr__ first; it's what lists and the REPL show.
Demo: 06_special_methods.ipynb builds Duration one method at a time. The lab's Score class (part 1) is the same pattern.
