---
label: Gotchas, single-threaded
---
# Multithreaded Gotchas

<div class="cols">

```python
import threading

counter = 0

def increment(n):
    return n + 1

def work():
    global counter
    for _ in range(1_000_000):
        counter = increment(counter)
```

<!-- col -->

```python
for _ in range(4):
    work()

print(counter)
```

</div>

<!-- notes -->
Baseline: the same work() called four times, one after another. Always prints 4,000,000.
Next slide changes only the right-hand column: the same four calls, now on four threads.
