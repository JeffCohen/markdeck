# Imperative vs. Functional

<div class="cols">

### Imperative: *how*

```python
total = 0
count = 0
for m in movies:
    if m["rating"] is not None:
        total += m["rating"]
        count += 1
average = total / count
```

<!-- col -->

### Functional: *what*

```python
ratings = [m["rating"] for m in movies
           if m["rating"] is not None]
average = sum(ratings) / len(ratings)
```

</div>

<!-- notes -->
Same answer, two styles. Both are fine Python.
Imperative: a recipe of steps that change variables (total, count) as the loop runs. To know what total holds, you have to trace the loop in your head.
Functional: describe the result. No variable changes after it's set; each line is an expression built from smaller ones: a comprehension, sum, len.
Ask the class: in the lab, which steps felt functional? (cleaning: map; choosing: filter.) Which wanted a loop? (grouping into a dict.)
Python is happy to mix them. Use functional style for transform/filter/summarize, and a plain loop when you're building up something step by step, like a dict of lists.
Payoffs of the functional pieces: pure functions like parse_rating are easy to test on their own (the lab's checks did exactly that), and lazy pipelines handle data too big for memory.
Coming later: closures (functions that return functions), which lead to decorators.
