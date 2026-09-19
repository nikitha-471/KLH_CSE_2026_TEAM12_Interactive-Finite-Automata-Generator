"""
app.py
------
Flask REST API for the Interactive Finite Automata Generator.

Endpoint:
    POST /api/convert   { "regex": "(a|b)*abb" }
    -> { regex, postfix, alphabet, nfa: {...}, dfa: {...} }

Nothing about any specific regular expression is hard-coded: every request
runs the full pipeline (validate -> concatenation -> postfix ->
Thompson's Construction -> Subset Construction) from scratch on whatever
"regex" the client sends.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS

from automata.regex_parser import validate_regex, insert_concatenation, infix_to_postfix
from automata.nfa import build_nfa, get_all_states, get_alphabet, EPSILON
from automata.dfa import subset_construction

app = Flask(__name__)
CORS(app)  # allow the Vite dev server (http://localhost:5173) to call this API


@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})


@app.route('/api/convert', methods=['POST'])
def convert():
    payload = request.get_json(silent=True) or {}
    regex = (payload.get('regex') or '').strip()

    try:
        # ---- Step 1: validate --------------------------------------------------
        validate_regex(regex)

        # ---- Step 2: explicit concatenation + postfix ---------------------------
        expr_with_concat = insert_concatenation(regex)
        postfix_tokens = infix_to_postfix(expr_with_concat)
        postfix = ''.join(postfix_tokens)

        # ---- Step 3: Thompson's Construction -------------------------------------
        fragment = build_nfa(postfix_tokens)
        nfa_states = get_all_states(fragment.start)
        alphabet = get_alphabet(nfa_states)

        sorted_nfa_states = sorted(nfa_states, key=lambda s: s.id)

        nfa_transitions = []
        for state in sorted_nfa_states:
            for symbol, targets in state.transitions.items():
                label = 'ε' if symbol == EPSILON else symbol
                for target in sorted(targets, key=lambda s: s.id):
                    nfa_transitions.append({
                        "from": f"q{state.id}",
                        "symbol": label,
                        "to": f"q{target.id}",
                    })

        # ---- Step 4: Subset Construction -----------------------------------------
        dfa_state_sets, dfa_transitions_map, dfa_start, dfa_accepting = subset_construction(
            fragment.start, fragment.accept, alphabet
        )

        dfa_transitions = []
        for name, trans in dfa_transitions_map.items():
            for symbol, target in trans.items():
                dfa_transitions.append({"from": name, "symbol": symbol, "to": target})

        dfa_state_map = {
            name: sorted(f"q{s.id}" for s in state_set)
            for state_set, name in dfa_state_sets.items()
        }

        response = {
            "regex": regex,
            "expr_with_concat": expr_with_concat,
            "postfix": postfix,
            "alphabet": alphabet,
            "nfa": {
                "states": [f"q{s.id}" for s in sorted_nfa_states],
                "start": f"q{fragment.start.id}",
                "accept": f"q{fragment.accept.id}",
                "num_states": len(nfa_states),
                "num_transitions": len(nfa_transitions),
                "transitions": nfa_transitions,
            },
            "dfa": {
                "states": sorted(dfa_state_sets.values()),
                "start": dfa_start,
                "accepting": sorted(dfa_accepting),
                "num_states": len(dfa_state_sets),
                "alphabet": alphabet,
                "transitions": dfa_transitions,
                "state_map": dfa_state_map,
            },
        }
        return jsonify(response), 200

    except ValueError as err:
        # Friendly, expected errors (empty input, bad parentheses, bad syntax, ...)
        return jsonify({"error": str(err)}), 400
    except Exception:
        # Anything unexpected still gets caught so the API never 500s on bad input
        return jsonify({"error": "Invalid Regular Expression."}), 400


if __name__ == '__main__':
    app.run(debug=True, port=5000)
