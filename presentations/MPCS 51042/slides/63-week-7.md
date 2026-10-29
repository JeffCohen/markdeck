---
part: Week 7
---
# Week 7

* Testing: from `assert` to `pytest`
* Test fixtures
* Test-driven development (TDD)
* Lab: the Bowling Kata
* Lessons from Apollo
* Quiz 6

<!-- notes -->
pytest bridge: every homework already checks itself with check() and assert. pytest is that idea done properly: test_*.py files, plain assert, one command (uv run pytest) to run them all. uv add --dev pytest in a uv project from week 5.
Bowling Kata (Bob Martin): with week 5-6 OO in hand, students are tempted to design Frame and Roll classes up front. TDD drives it down to one small class with a list of rolls. Same lesson as Axelrod's Copycat in week 5: simple wins.
Last year's week 4 work folder (strmod.py, test_strmod.py) is a smaller pytest warm-up if needed.
Apollo: work incrementally, modular encapsulation, systems thinking, simulation testing: fits TDD.
Quiz 6 covers week 6: duck typing, class vs. instance attributes, inheritance.
