# Where yield Goes

<div class="cols">

<div class="code-sm">

```python
def countdown(n):
    while n > 0:
        yield n
        n -= 1

c = countdown(2)
got = next(c)
got = next(c)
got = next(c)
```

</div>

<span class="accent">Usually, something else calls <code>next()</code>:</span>

<div class="code-sm">

```python
for got in countdown(2):
    print(got)

list(countdown(3))   # [3, 2, 1]
sum(countdown(100))  # 5050
```

</div>

<!-- col -->

<svg viewBox="0 0 520 430" role="img" aria-label="Time runs down. Making c runs nothing. Each next(c) runs countdown until the next yield; the yielded value travels back and lands in got: first 2, then 1. The third next(c) resumes, the loop ends, and StopIteration comes back instead of a value." style="width:100%;height:auto;max-height:64vh;color:var(--md-fg);font-family:var(--md-font-mono);font-size:17px">
<text x="10" y="20" font-size="15" fill="#2dd4bf">CALLER</text>
<text x="330" y="20" font-size="15" fill="#2dd4bf">countdown(2)</text>
<g stroke-width="1.2" stroke-dasharray="4 6" style="stroke:var(--md-muted)"><line x1="160" y1="30" x2="160" y2="420"/><line x1="320" y1="30" x2="320" y2="420"/></g>
<text x="10" y="64" fill="currentColor">c = countdown(2)</text>
<text x="330" y="64" font-size="15" style="fill:var(--md-muted)">paused at the top</text>
<line x1="160" y1="110" x2="306" y2="110" stroke-width="2" stroke="currentColor"/><polygon points="320,110 306,116 306,104" fill="currentColor"/>
<text x="10" y="116" fill="currentColor">next(c)</text>
<text x="330" y="116" font-size="15" fill="currentColor">runs to yield 2</text>
<line x1="320" y1="150" x2="174" y2="150" stroke-width="2.5" style="stroke:var(--md-accent)"/><polygon points="160,150 174,144 174,156" style="fill:var(--md-accent)"/>
<rect x="222" y="134" width="32" height="30" rx="6" fill="var(--md-bg)" stroke-width="2" style="stroke:var(--md-accent)"/>
<text x="238" y="155" text-anchor="middle" style="fill:var(--md-accent)">2</text>
<text x="10" y="156" style="fill:var(--md-accent)">got = 2</text>
<text x="330" y="156" font-size="15" style="fill:var(--md-muted)">paused</text>
<line x1="160" y1="210" x2="306" y2="210" stroke-width="2" stroke="currentColor"/><polygon points="320,210 306,216 306,204" fill="currentColor"/>
<text x="10" y="216" fill="currentColor">next(c)</text>
<text x="330" y="216" font-size="15" fill="currentColor">resumes, n -= 1,</text>
<text x="330" y="236" font-size="15" fill="currentColor">runs to yield 1</text>
<line x1="320" y1="270" x2="174" y2="270" stroke-width="2.5" style="stroke:var(--md-accent)"/><polygon points="160,270 174,264 174,276" style="fill:var(--md-accent)"/>
<rect x="222" y="254" width="32" height="30" rx="6" fill="var(--md-bg)" stroke-width="2" style="stroke:var(--md-accent)"/>
<text x="238" y="275" text-anchor="middle" style="fill:var(--md-accent)">1</text>
<text x="10" y="276" style="fill:var(--md-accent)">got = 1</text>
<text x="330" y="276" font-size="15" style="fill:var(--md-muted)">paused</text>
<line x1="160" y1="330" x2="306" y2="330" stroke-width="2" stroke="currentColor"/><polygon points="320,330 306,336 306,324" fill="currentColor"/>
<text x="10" y="336" fill="currentColor">next(c)</text>
<text x="330" y="336" font-size="15" fill="currentColor">resumes, loop ends,</text>
<text x="330" y="356" font-size="15" fill="currentColor">no more yields</text>
<line x1="320" y1="390" x2="174" y2="390" stroke-width="2.5" style="stroke:var(--md-highlight)"/><polygon points="160,390 174,384 174,396" style="fill:var(--md-highlight)"/>
<text x="10" y="396" style="fill:var(--md-highlight)">StopIteration</text>
</svg>

</div>

<!-- notes -->
Time runs down the picture. Two sides take turns: only one of them is ever running.
c = countdown(2) runs NOTHING in the body. It makes a generator, paused before the first line.
next(c) hands control to the body. It runs until a yield. yield n sends n BACK across: it becomes the value of the next(c) expression, exactly like a return value becomes the value of a function call. That's where the value goes: into got.
Unlike return, yield doesn't end the function. The body pauses right after the yield, with n and the loop remembered, until the next next(c).
Second next(c): resumes after the yield, n -= 1, loops, yield 1. Third: resumes, the loop ends, the body finishes without a yield, so next raises StopIteration (an exception, from earlier tonight).
Second code block: the usual way. You rarely call next() yourself; a for loop, list(), sum(), max() etc. call it for you. A for loop is this picture on repeat: for got in countdown(2): calls next for you, puts each yielded value in got, and stops quietly at StopIteration.
Demo: 04_lazy.ipynb section 4. The prints there label each line "caller:" or "countdown:" so students can see the turns in the output.
