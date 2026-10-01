---
chapter: Week 1 Content
---
# Backus-Naur Form

_by John Backus and Peter Naur, 1960_

A notation for describing the **syntax** of a language — which strings are legal.

```
<sum>     ::= <integer> | <integer> "+" <sum>
<integer> ::= <digit> | <digit> <integer>
<digit>   ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
```

<div class="cols">

* `<name>` — a rule (non-terminal)
* `"text"` — literal characters (terminal)
* `::=` — "is defined as"
* `|` — "or"

<!-- col -->

<span class="accent">Valid</span> `<sum>`: `7` · `42` · `3+14+159`

<span class="highlight">Invalid</span> `<sum>`: `+3` · `4+` · `1++2`

</div>

<!-- notes -->
Created by John Backus and Peter Naur to define ALGOL 60 (1960).
Point out that <integer> and <sum> are recursive — that's how a finite grammar describes infinitely many strings.
Walk through deriving 3+14: <sum> → <integer> "+" <sum> → ...
