---
part: Week 4
---
# WE WILL RESUME AT 7:05pm

* **Exam 1**

* YES: Google, Notes, Homework, Quizzes
* NO: Google AI, Claude, other people

BREAK (Download week4.zip from Files/Lectures in Canvas)

* Files (from week 3)
* Converting vs. casting
* Exceptions
* `map` and `filter` vs. comprehensions
* Lazy evaluation: generators and `yield`
* Lab: a weather pipeline, with live data from a web API
* Imperative vs. functional style

<!-- notes -->
Class order is in ~/mpcs/2026/lectures/week4/SCRIPT.md (instructor only). Students' copy of the agenda: week4/README.md.
Second half of the functional module. Week 3 covered the first half (06_functional_basics.ipynb): functions as values, lambda, comprehensions, pure functions, sum/min/max/any/all/zip/enumerate.
Files come first because week 3 ran out of time before 08_files.py, and its last TODO ("what happens with a file that doesn't exist?") opens exceptions.
Generator expressions: same syntax as a comprehension with parentheses, e.g. any(n > 40 for n in nums). Week 3 deliberately wrote any([...]) with brackets.
Moved out of this week: closures (later, with decorators; they're also where the E in LEGB comes in), functools.reduce and itertools (dropped for now), and uv / 10_fancy_word_count.py / 11_breakout.py (week 5, with "Managing a project with uv").
Lab: 05_weather.py, live forecasts from open-meteo.com through urllib, a teaser for week 5's requests. The movies lab (last year's lab 3) moved to Homework 4: ~/mpcs/2026/hw/week4/.
