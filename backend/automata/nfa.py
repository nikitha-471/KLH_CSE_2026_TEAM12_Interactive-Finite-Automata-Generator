"""
nfa.py
------
NFAState / Fragment data structures + Thompson's Construction.
"""

import itertools

EPSILON = 'ε'


class NFAState:
    """A single state of an NFA.

    Every state gets an auto-incrementing id so we can label it q0, q1, q2, ...
    Transitions are stored as: { symbol_or_EPSILON: [NFAState, NFAState, ...] }
    """
    _id_counter = itertools.count()

    def __init__(self):
        self.id = next(NFAState._id_counter)
        self.transitions = {}

    def add_transition(self, symbol, state):
        self.transitions.setdefault(symbol, []).append(state)

    # Needed so NFAState objects can live inside Python sets / be dict keys
    def __hash__(self):
        return hash(self.id)

    def __eq__(self, other):
        return isinstance(other, NFAState) and self.id == other.id

    def __repr__(self):
        return f"q{self.id}"


class Fragment:
    """A partially built NFA: just remembers its start state and accept state."""
    def __init__(self, start, accept):
        self.start = start
        self.accept = accept


def build_nfa(postfix_tokens):
    """Thompson's Construction: build an NFA (as a Fragment) from postfix tokens."""

    # Reset numbering so every fresh Regular Expression starts again at q0
    NFAState._id_counter = itertools.count()

    stack = []

    for token in postfix_tokens:

        if token == '*':                       # Kleene star: zero or more
            frag = stack.pop()
            start, accept = NFAState(), NFAState()
            start.add_transition(EPSILON, frag.start)
            start.add_transition(EPSILON, accept)
            frag.accept.add_transition(EPSILON, frag.start)
            frag.accept.add_transition(EPSILON, accept)
            stack.append(Fragment(start, accept))

        elif token == '+':                     # one or more
            frag = stack.pop()
            start, accept = NFAState(), NFAState()
            start.add_transition(EPSILON, frag.start)
            frag.accept.add_transition(EPSILON, frag.start)
            frag.accept.add_transition(EPSILON, accept)
            stack.append(Fragment(start, accept))

        elif token == '?':                     # zero or one (optional)
            frag = stack.pop()
            start, accept = NFAState(), NFAState()
            start.add_transition(EPSILON, frag.start)
            start.add_transition(EPSILON, accept)
            frag.accept.add_transition(EPSILON, accept)
            stack.append(Fragment(start, accept))

        elif token == '.':                     # concatenation
            frag2 = stack.pop()
            frag1 = stack.pop()
            frag1.accept.add_transition(EPSILON, frag2.start)
            stack.append(Fragment(frag1.start, frag2.accept))

        elif token == '|':                     # union / alternation
            frag2 = stack.pop()
            frag1 = stack.pop()
            start, accept = NFAState(), NFAState()
            start.add_transition(EPSILON, frag1.start)
            start.add_transition(EPSILON, frag2.start)
            frag1.accept.add_transition(EPSILON, accept)
            frag2.accept.add_transition(EPSILON, accept)
            stack.append(Fragment(start, accept))

        else:                                   # a plain symbol, e.g. 'a'
            start, accept = NFAState(), NFAState()
            start.add_transition(token, accept)
            stack.append(Fragment(start, accept))

    if len(stack) != 1:
        raise ValueError("Invalid Regular Expression.")

    return stack.pop()


def get_all_states(start_state):
    """Depth-first traversal to collect every NFAState reachable from start_state."""
    visited = set()
    to_visit = [start_state]
    while to_visit:
        state = to_visit.pop()
        if state in visited:
            continue
        visited.add(state)
        for _, targets in state.transitions.items():
            for t in targets:
                if t not in visited:
                    to_visit.append(t)
    return visited


def get_alphabet(states):
    """Every non-epsilon symbol used anywhere in the NFA, sorted."""
    alphabet = set()
    for state in states:
        for symbol in state.transitions:
            if symbol != EPSILON:
                alphabet.add(symbol)
    return sorted(alphabet)
