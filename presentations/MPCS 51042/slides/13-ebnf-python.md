# Python's `if` Grammar

```python
if temperature > 90:
    print("It's hot!")
```

```
if_stmt: "if" named_expression ":" block
         ("elif" named_expression ":" block)*
         ["else" ":" block]

named_expression:       [identifier ":="] expression
expression:             conditional_expression | lambda_expr
conditional_expression: or_test ["if" or_test "else" expression]

block:     stmt_list NEWLINE | NEWLINE INDENT statement+ DEDENT
statement: stmt_list NEWLINE | compound_stmt
stmt_list: simple_stmt (";" simple_stmt)* [";"]
```

<!-- notes -->
From the Python 3.14 Language Reference (compound_stmts.html and expressions.html), except two names follow CPython's actual grammar file (Grammar/python.gram): the Reference calls block "suite" and named_expression "assignment_expression". In python.gram, assignment_expression means only the walrus form (NAME := expression).
"if" and ":" are literal keywords and punctuation.
named_expression is the condition — any expression, optionally with the walrus: if (n := len(xs)) > 10:
block is the body: either statements on the same line (if x: y = 1) or an indented block. NEWLINE, INDENT, DEDENT are tokens the tokenizer produces — this is where indentation enters the grammar.
statement includes compound_stmt, which includes if_stmt — that's the recursion that allows nested ifs.
( ... )* means any number of elifs, including none; [ ... ] means at most one else.
Ask the class what the rule forbids: an else before an elif, two elses, an elif with no if.
expression is either a conditional expression (x if cond else y — the plain case is just or_test with no if/else) or a lambda. or_test continues down through and_test, not_test, comparison, and the arithmetic operators — each level is one step of operator precedence.
or_test, lambda_expr, simple_stmt, compound_stmt are defined elsewhere in the reference — the full grammar is hundreds of rules.
