# Modern Notation (EBNF)

```
sum:     integer ("+" integer)*
integer: digit+
digit:   "0"..."9"
```

<!-- notes -->
Same idea as BNF, less punctuation: bare rule names, and regex-like operators replace most recursion.
x* zero or more · x+ one or more · [x] optional · ( ) grouping.
This style goes by EBNF (Extended BNF); the rule-colon form comes from yacc/bison, the C-era parser generators, which is why some call it "C-style". Exact symbols vary by tool (some use ::= or =, ? instead of [ ]).
Same language as the previous slide: 3+14+159 is still valid. Recursion became repetition.
Python docs: https://docs.python.org/3/reference/introduction.html#notation
