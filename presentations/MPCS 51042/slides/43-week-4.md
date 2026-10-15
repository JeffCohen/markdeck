---
part: Week 4
---
# Week 4

* **Exam 1**
* `map` and `filter` vs. comprehensions
* Lazy evaluation: generator expressions, `yield`, generator functions
* `functools.reduce` and a taste of `itertools`
* Closures: functions that return functions
* The `assert` statement
* Exceptions
* Lab: pipeline architectures
* Imperative vs. functional style

<!-- notes -->
Second half of the functional module. Week 3 covered the first half (lectures/week3/06_functional_basics.ipynb): functions as values, lambda, list/dict/set comprehensions, statements vs expressions, pure functions vs side effects, and sum/min/max/any/all/zip/enumerate.
Generator expressions: same syntax as a comprehension without the brackets, e.g. any(n > 40 for n in nums). Week 3 deliberately wrote any([...]) with brackets.
Closures set up decorators later in the course. They're also where to add the E in LEGB (week 3's Scope slide shows only Local, Global, Built-in) and the lexical vs dynamic scope contrast.
Lab adapted from last year's week 3 (lectures/week3, labs/lab3: the movies.csv pipeline), ending with the imperative vs functional summary.
Exceptions could move into week 3's 08_files.py (FileNotFoundError) if this week runs long.
