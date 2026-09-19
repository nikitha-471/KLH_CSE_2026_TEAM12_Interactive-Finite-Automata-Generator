# The "automata" package groups every piece of the RE -> NFA -> DFA pipeline:
#   regex_parser.py  -> validation, explicit concatenation, infix->postfix
#   nfa.py           -> NFAState, Fragment, Thompson's Construction
#   dfa.py           -> epsilon_closure, move, Subset Construction
