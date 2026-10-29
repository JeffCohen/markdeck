---
part: Week 5
---
# Week 5

* Imperative vs. functional style (from week 4)
* Installing packages: `uv` and PyPI
* Managing a project with `uv`: `init`, `add`, `sync`, `run`
* Web data with `requests`

BREAK

* Classes and objects: encapsulation
* Special methods: making objects act like built-ins
* Lab: classes and objects
* Quiz 4

<!-- notes -->
Adapted from last year's week 4 (lectures/week4: uv project, strmod.py + test_strmod.py; labs/lab4).
Already covered this year, so dropped: string interpolation (f-strings since week 2-3) and filter() (week 4). Last year's "functional thinking" lab is covered by week 4's weather lab and Homework 4.
Carried over: Imperative vs. Functional (the last week 4 slide, not reached). Week 3's Installing Packages and Single-File Scripts slides, with 10_fancy_word_count.py and 11_breakout.py, were never shown: they open the uv part.
requests: same open-meteo weather API as the week 4 lab, now with requests instead of urllib. Natural reason to make a uv project: requests isn't in the standard library.
Second half is OO (moved up from week 6): students already wrote __init__, __len__, and __getitem__ for MyList and the Movie class in week 3, so this names and extends what they've done. pytest and TDD move to week 7, where the Bowling Kata needs classes first: without TDD, an OO mindset over-engineers it (Frame and Roll classes); with TDD, the tests drive it down to one small class.
Pair programming: not covered this year.
Still deferred: closures (with decorators, later).
Quiz 4 covers week 4: files, exceptions and finally, map/filter, generators and yield.
