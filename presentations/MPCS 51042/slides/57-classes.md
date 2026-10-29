# One Class, Many Objects

<div class="cols">

```python
class Counter:
    def __init__(self):
        self.count = 0

    def bump(self):
        self.count += 1

a = Counter()
b = Counter()
a.bump()
a.bump()
b.bump()
```

<!-- col -->

<svg viewBox="0 0 520 445" role="img" aria-label="The class Counter holds the methods __init__ and bump. Two objects, a and b, each hold their own count: 2 and 1. Each object points to its class. a.bump() looks up bump in the class and passes a in as self." style="width:100%;height:auto;max-height:64vh;color:var(--md-fg);font-family:var(--md-font-mono);font-size:19px">
<rect x="130" y="20" width="260" height="140" rx="10" fill="none" stroke-width="2.5" style="stroke:var(--md-accent)"/>
<text x="150" y="54" font-size="20" font-weight="600" style="fill:var(--md-accent)">class Counter</text>
<line x1="148" y1="70" x2="372" y2="70" stroke-width="1" style="stroke:var(--md-muted)"/>
<text x="160" y="104" fill="currentColor">__init__</text>
<text x="160" y="140" fill="currentColor">bump</text>
<text x="270" y="140" font-size="14" fill="#2dd4bf">methods: once</text>
<rect x="20" y="260" width="200" height="110" rx="10" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="40" y="294" font-size="20" font-weight="600" fill="currentColor">a</text>
<line x1="38" y1="308" x2="202" y2="308" stroke-width="1" style="stroke:var(--md-muted)"/>
<text x="40" y="344" fill="currentColor">count</text>
<text x="150" y="344" style="fill:var(--md-highlight)">2</text>
<rect x="300" y="260" width="200" height="110" rx="10" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="320" y="294" font-size="20" font-weight="600" fill="currentColor">b</text>
<line x1="318" y1="308" x2="482" y2="308" stroke-width="1" style="stroke:var(--md-muted)"/>
<text x="320" y="344" fill="currentColor">count</text>
<text x="430" y="344" style="fill:var(--md-highlight)">1</text>
<g stroke-width="1.8" stroke-dasharray="6 5" style="stroke:var(--md-muted)"><line x1="120" y1="258" x2="200" y2="172"/><line x1="400" y1="258" x2="320" y2="172"/></g>
<g style="fill:var(--md-muted)"><polygon points="208,163 204,178 193,170"/><polygon points="312,163 327,170 316,178"/></g>
<text x="20" y="396" font-size="14" fill="#2dd4bf">data: one set per object</text>
<text x="260" y="436" text-anchor="middle" font-size="17" fill="currentColor">a.bump()  is  Counter.bump(a)</text>
</svg>

</div>

<!-- notes -->
A class bundles data with the functions that work on it. They wrote two already in week 3: Movie and MyList.
Data lives in each object: a and b each have their own count. Methods live once, in the class: there's one bump, shared by every Counter.
Each object knows its class (the dashed arrows: type(a) is Counter). a.bump() looks for bump in a, doesn't find it, looks in the class, and calls it with a as the first argument. That first parameter is self: nothing magic, just the object the method was called on.
Tie-back: an object's attributes are a namespace, a dict. a.__dict__ is {'count': 2}. Same idea as A Namespace Is a Dictionary and Frames: A Namespace per Call.
Encapsulation: the rest of the program asks the object to do things (a.bump()) instead of reaching in and changing count itself. The rules for changing the data live in one place, the class. The notebook's Account shows why: deposit and withdraw enforce the rules.
Python has no truly private attributes. A leading underscore (self._balance) is a convention: "internal, please don't touch."
Demo: 05_classes.ipynb.
