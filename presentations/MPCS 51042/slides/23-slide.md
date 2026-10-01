---
label: Gotchas, threaded
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
threads = []
for _ in range(4):
    t = threading.Thread(target=work)
    t.start()
    threads.append(t)

for t in threads:
    t.join()

print(counter)
```

</div>

<!-- notes -->
Ask first: four threads, a million increments each — what prints? Expect 4,000,000.
Actual runs on 3.12/3.13: 2,550,516 · 1,436,832 · 2,742,554 — different every time. Runs in under a second, safe to demo live.
The race: thread A reads counter (say 100) and calls increment(); the interpreter switches to thread B, which also reads 100 and stores 101; A resumes and stores its stale 101. B's update is lost.
Shared heap from the Threads slide: every thread sees the same counter.
Why the increment() call: since 3.10 CPython only switches threads at certain points (function calls, loop back-edges). A bare counter += 1 loop happens to survive on GIL builds — but that's an implementation accident, not a guarantee, and it races on free-threaded Python. Real code nearly always has a call between the read and the write.
