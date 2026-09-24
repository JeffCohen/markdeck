# Python's `if` Grammar

```
if_stmt: "if" assignment_expression ":" suite
         ("elif" assignment_expression ":" suite)*
         ["else" ":" suite]

assignment_expression: [identifier ":="] expression

suite:     stmt_list NEWLINE | NEWLINE INDENT statement+ DEDENT
statement: stmt_list NEWLINE | compound_stmt
stmt_list: simple_stmt (";" simple_stmt)* [";"]
```

<!-- notes -->
Verbatim from the Python 3.14 Language Reference (compound_stmts.html and expressions.html).
"if" and ":" are literal keywords and punctuation.
assignment_expression is the condition — any expression, optionally with the walrus: if (n := len(xs)) > 10:
suite is the body: either statements on the same line (if x: y = 1) or an indented block. NEWLINE, INDENT, DEDENT are tokens the tokenizer produces — this is where indentation enters the grammar.
statement includes compound_stmt, which includes if_stmt — that's the recursion that allows nested ifs.
( ... )* means any number of elifs, including none; [ ... ] means at most one else.
Ask the class what the rule forbids: an else before an elif, two elses, an elif with no if.
expression, simple_stmt, compound_stmt are defined elsewhere in the reference — the full grammar is hundreds of rules.
