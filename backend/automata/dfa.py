"""
dfa.py
------
NFA -> DFA conversion via Subset Construction.
"""

import string


def epsilon_closure(states, epsilon='ε'):
    """Epsilon-closure of a set/iterable of NFAState objects. Returns a frozenset."""
    stack = list(states)
    closure = set(states)
    while stack:
        state = stack.pop()
        for target in state.transitions.get(epsilon, []):
            if target not in closure:
                closure.add(target)
                stack.append(target)
    return frozenset(closure)


def move(states, symbol):
    """All NFA states reachable from `states` by consuming exactly one `symbol`."""
    result = set()
    for state in states:
        for target in state.transitions.get(symbol, []):
            result.add(target)
    return frozenset(result)


def dfa_name_generator():
    """Yields DFA state names: A, B, C, ... Z, A1, B1, ... Z1, A2, ..."""
    letters = string.ascii_uppercase
    round_num = 0
    while True:
        for letter in letters:
            yield letter if round_num == 0 else f"{letter}{round_num}"
        round_num += 1


def subset_construction(nfa_start, nfa_accept, alphabet, epsilon='ε'):
    """Convert an NFA (start state + accept state + alphabet) into a DFA.

    Returns:
        dfa_state_sets : dict {frozenset(NFAState): dfa_name}
        dfa_transitions: dict {dfa_name: {symbol: dfa_name}}
        start_name     : name of the DFA start state
        accepting_names: set of DFA state names that are accepting
    """
    names = dfa_name_generator()

    start_closure = epsilon_closure({nfa_start}, epsilon)
    dfa_state_sets = {start_closure: next(names)}
    start_name = dfa_state_sets[start_closure]

    dfa_transitions = {}
    unmarked = [start_closure]

    while unmarked:
        current_set = unmarked.pop(0)
        current_name = dfa_state_sets[current_set]
        dfa_transitions[current_name] = {}

        for symbol in alphabet:
            target_set = epsilon_closure(move(current_set, symbol), epsilon)
            if not target_set:
                continue
            if target_set not in dfa_state_sets:
                dfa_state_sets[target_set] = next(names)
                unmarked.append(target_set)
            dfa_transitions[current_name][symbol] = dfa_state_sets[target_set]

    accepting_names = {name for state_set, name in dfa_state_sets.items()
                        if nfa_accept in state_set}

    return dfa_state_sets, dfa_transitions, start_name, accepting_names
