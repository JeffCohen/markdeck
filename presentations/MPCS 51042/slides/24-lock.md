# Fix: a Lock

```python
lock = threading.Lock()

def work():
    global counter
    for _ in range(1_000_000):
        with lock:
            counter = increment(counter)
```

<!-- notes -->
Only one thread can hold the lock; the others wait at "with lock:" until it is released. The read, the call, and the write now happen as one step.
Prints 4,000,000 every time.
The cost: threads now take turns through that block, so this part runs one thread at a time — keep locked sections small.
Other gotchas worth naming: deadlock (two threads each waiting for the lock the other holds), and forgetting to lock one of the places that touches shared data.
