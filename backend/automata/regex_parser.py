"""
regex_parser.py
----------------
Turns a raw Regular Expression typed by the user into a postfix token list
that Thompson's Construction can consume.

Pipeline:  raw string -> validate_regex() -> insert_concatenation() -> infix_to_postfix()
"""

import string

ALLOWED_CHARS = set(string.ascii_letters + string.digits) | set('()|*+?.')
PRECEDENCE = {'|': 1, '.': 2, '*': 3, '+': 3, '?': 3}


def validate_regex(expr):
    """Raise ValueError with a friendly message if the expression is clearly invalid."""
    if expr is None or expr.strip() == "":
        raise ValueError("Please enter a Regular Expression.")

    for ch in expr:
        if ch not in ALLOWED_CHARS:
            raise ValueError("Invalid Regular Expression.")

    # Balanced-parentheses check
    balance = 0
    for ch in expr:
        if ch == '(':
            balance += 1
        elif ch == ')':
            balance -= 1
        if balance < 0:
            raise ValueError("Invalid Regular Expression: Check your parentheses.")
    if balance != 0:
        raise ValueError("Invalid Regular Expression: Check your parentheses.")

    if expr[0] in ('*', '+', '?', '|', ')'):
        raise ValueError("Invalid Regular Expression.")
    if expr[-1] in ('|', '('):
        raise ValueError("Invalid Regular Expression.")

    for i in range(len(expr) - 1):
        a, b = expr[i], expr[i + 1]
        if a == '(' and b == ')':
            raise ValueError("Invalid Regular Expression: Check your parentheses.")
        if a == '|' and b in ('|', ')', '*', '+', '?'):
            raise ValueError("Invalid Regular Expression.")
        if a == '(' and b in ('|', '*', '+', '?'):
            raise ValueError("Invalid Regular Expression.")

    return True


def insert_concatenation(expr):
    """Insert an explicit '.' wherever concatenation is implied.

    Example:  'ab(c|d)*e'  ->  'a.b.(c|d)*.e'
    """
    output = []
    for i, ch in enumerate(expr):
        output.append(ch)
        if i + 1 < len(expr):
            nxt = expr[i + 1]
            left_can_end_expression = ch.isalnum() or ch in (')', '*', '+', '?')
            right_can_start_expression = nxt.isalnum() or nxt == '('
            if left_can_end_expression and right_can_start_expression:
                output.append('.')
    return ''.join(output)


def infix_to_postfix(expr):
    """Classic shunting-yard algorithm: infix expression -> list of postfix tokens."""
    output = []
    op_stack = []

    for token in expr:
        if token.isalnum():
            output.append(token)

        elif token == '(':
            op_stack.append(token)

        elif token == ')':
            while op_stack and op_stack[-1] != '(':
                output.append(op_stack.pop())
            if not op_stack:
                raise ValueError("Invalid Regular Expression: Check your parentheses.")
            op_stack.pop()

        elif token in PRECEDENCE:
            while (op_stack and op_stack[-1] != '(' and
                   PRECEDENCE.get(op_stack[-1], 0) >= PRECEDENCE[token]):
                output.append(op_stack.pop())
            op_stack.append(token)

        else:
            raise ValueError("Invalid Regular Expression.")

    while op_stack:
        top = op_stack.pop()
        if top == '(':
            raise ValueError("Invalid Regular Expression: Check your parentheses.")
        output.append(top)

    if not output:
        raise ValueError("Invalid Regular Expression.")

    return output
