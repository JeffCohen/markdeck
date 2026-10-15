# Frames: A Namespace per Call

<div class="cols">

```python
nums = [4, 8, 15]

def add_up(values):
    total = sum(values)
    return total

def average(items):
    total = add_up(items)
    return total / len(items)

average(nums)
```

<!-- col -->

<svg viewBox="0 0 520 436" role="img" aria-label="The call stack as three tables of names and values, newest on top, with every value an arrow to an object on the heap. add_up: values to the list, total to the int 27. average: items to the list, total not set yet. module: nums to the list, add_up and average to their function objects." style="width:100%;height:auto;max-height:64vh;color:var(--md-fg);font-family:var(--md-font-mono);font-size:20px">
<text x="4" y="20" font-size="17" fill="#2dd4bf">CALL STACK  newest on top</text>
<text x="280" y="20" font-size="17" fill="#2dd4bf">HEAP</text>
<text x="280" y="46" font-size="15" fill="#2dd4bf">every value is an object</text>
<rect x="4" y="34" width="256" height="36" rx="6" fill="currentColor" fill-opacity="0.16"/>
<rect x="4" y="34" width="256" height="108" rx="7" fill="none" stroke-width="2" stroke="currentColor"/>
<text x="16" y="59" font-size="20" font-weight="600" fill="currentColor">add_up(values)</text>
<line x1="4" y1="70" x2="260" y2="70" stroke-width="1.2" style="stroke:var(--md-muted)"/>
<text x="18" y="95" font-size="20" fill="currentColor">values</text>
<circle cx="174" cy="88.0" r="6" fill="currentColor"/>
<line x1="4" y1="106" x2="260" y2="106" stroke-width="1.2" style="stroke:var(--md-muted)"/>
<text x="18" y="131" font-size="20" fill="currentColor">total</text>
<circle cx="174" cy="124.0" r="6" fill="currentColor"/>
<line x1="134" y1="70" x2="134" y2="142" stroke-width="1.2" style="stroke:var(--md-muted)"/>
<rect x="4" y="158" width="256" height="36" rx="6" fill="currentColor" fill-opacity="0.16"/>
<rect x="4" y="158" width="256" height="108" rx="7" fill="none" stroke-width="2" stroke="currentColor"/>
<text x="16" y="183" font-size="20" font-weight="600" fill="currentColor">average(items)</text>
<line x1="4" y1="194" x2="260" y2="194" stroke-width="1.2" style="stroke:var(--md-muted)"/>
<text x="18" y="219" font-size="20" fill="currentColor">items</text>
<circle cx="174" cy="212.0" r="6" fill="currentColor"/>
<line x1="4" y1="230" x2="260" y2="230" stroke-width="1.2" style="stroke:var(--md-muted)"/>
<text x="18" y="255" font-size="20" fill="currentColor">total</text>
<text x="146" y="254" font-size="18" fill="#2dd4bf">not set</text>
<line x1="134" y1="194" x2="134" y2="266" stroke-width="1.2" style="stroke:var(--md-muted)"/>
<rect x="4" y="282" width="256" height="36" rx="6" style="fill:var(--md-accent)" fill-opacity="0.16"/>
<rect x="4" y="282" width="256" height="144" rx="7" fill="none" stroke-width="2.5" style="stroke:var(--md-accent)"/>
<text x="16" y="307" font-size="20" font-weight="600" fill="currentColor">&lt;module&gt;</text>
<line x1="4" y1="318" x2="260" y2="318" stroke-width="1.2" style="stroke:var(--md-muted)"/>
<text x="18" y="343" font-size="20" fill="currentColor">nums</text>
<circle cx="174" cy="336.0" r="6" style="fill:var(--md-accent)"/>
<line x1="4" y1="354" x2="260" y2="354" stroke-width="1.2" style="stroke:var(--md-muted)"/>
<text x="18" y="379" font-size="20" fill="currentColor">add_up</text>
<circle cx="174" cy="372.0" r="6" style="fill:var(--md-accent)"/>
<line x1="4" y1="390" x2="260" y2="390" stroke-width="1.2" style="stroke:var(--md-muted)"/>
<text x="18" y="415" font-size="20" fill="currentColor">average</text>
<circle cx="174" cy="408.0" r="6" style="fill:var(--md-accent)"/>
<line x1="134" y1="318" x2="134" y2="426" stroke-width="1.2" style="stroke:var(--md-muted)"/>
<rect x="280" y="107.0" width="72" height="34" rx="7" fill="none" stroke-width="2" stroke="currentColor"/>
<text x="316.0" y="131.0" font-size="20" text-anchor="middle" fill="currentColor">27</text>
<line x1="174" y1="124" x2="267" y2="124" stroke-width="2" stroke="currentColor"/><polygon points="280,124 267,130 267,118" fill="currentColor"/>
<rect x="384" y="168" width="132" height="48" rx="7" fill="none" stroke-width="2" stroke="currentColor"/>
<text x="450.0" y="200" font-size="20" text-anchor="middle" fill="currentColor">[4, 8, 15]</text>
<polyline points="174,88.0 414,88.0" fill="none" stroke-width="2" stroke="currentColor"/>
<line x1="414" y1="88" x2="414" y2="155" stroke-width="2" stroke="currentColor"/><polygon points="414,168 408,155 420,155" fill="currentColor"/>
<line x1="174" y1="212" x2="371" y2="197" stroke-width="2" stroke="currentColor"/><polygon points="384,196 371,203 371,191" fill="currentColor"/>
<line x1="174" y1="336" x2="422" y2="221" stroke-width="2.5" style="stroke:var(--md-accent)"/><polygon points="434,216 425,227 420,216" style="fill:var(--md-accent)"/>
<rect x="280" y="356.0" width="236" height="32" rx="7" fill="none" stroke-width="2" stroke="currentColor"/>
<text x="292" y="378.0" font-size="16" fill="#2dd4bf">function add_up</text>
<line x1="174" y1="372" x2="267" y2="372" stroke-width="2.5" style="stroke:var(--md-accent)"/><polygon points="280,372 267,378 267,366" style="fill:var(--md-accent)"/>
<rect x="280" y="392.0" width="236" height="32" rx="7" fill="none" stroke-width="2" stroke="currentColor"/>
<text x="292" y="414.0" font-size="16" fill="#2dd4bf">function average</text>
<line x1="174" y1="408" x2="267" y2="408" stroke-width="2.5" style="stroke:var(--md-accent)"/><polygon points="280,408 267,414 267,402" style="fill:var(--md-accent)"/>
</svg>

</div>

<!-- notes -->
The picture is the moment add_up is about to return: three calls are in progress, newest on top.
Every CALL gets a fresh frame, and a frame is a namespace for that call's parameters and local variables.
Each frame is drawn as a table of name/value pairs: literally a small dict per call (locals() returns it). The module's own table, globals(), holds add_up and average too: def binds a name, just like Names Are Labels said.
Every value is a reference: total points at an int object, add_up and average at function objects, exactly like the list. (Python Tutor, pythontutor.com, draws small ints inline instead, but it's a good live demo of this exact code.) nums comes first in the module's table because it was bound first: a namespace dict keeps insertion order.
Same name, different frames: average and add_up each have their own total. They can't interfere. average's total isn't set yet (it gets add_up's result when add_up returns), while add_up's already holds 27.
Different names, same object: nums, items, and values all point at ONE list. Passing an argument binds a new name to the same object; nothing is copied. That's why add_tag could change the caller's list (Homework 2, problem 5).
Names live only in the tables; the heap only holds objects. The list doesn't know it's called nums, items, and values: those are three rows in three tables. An object no table can reach is garbage.
Lookup starts in the CURRENT frame's table, then the module's, then built-ins (next slide). That's how add_up finds sum. The caller's frame is NOT on that chain: add_up can't see average's items or total, even though average's frame sits right below it. Ask the class: can add_up use items?
Everything past the first name is following references, not looking up names: values[0], textkit.shout, movie.title.
When add_up returns, its frame and its names disappear; then average's total gets 27, and average returns 9.0. The list survives as long as some name still points at it.
This is the stack and heap from week 1's process slide, now with names inside. (Week 2's 06_call_stack.py showed a frame per call with countdown; recursion itself can wait.)
