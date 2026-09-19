# Interactive Finite Automata Generator
### Regular Expression → NFA (Thompson's Construction) → DFA (Subset Construction)

A full-stack Compiler Design mini-project: a **Flask** backend that dynamically builds an
NFA and DFA from any regular expression the user types, and a **React + Vite** frontend
with a modern UI and real, interactive graph visualizations (pan/zoom, via React Flow).

Nothing is hard-coded to one example — every request runs validation, postfix
conversion, Thompson's Construction and Subset Construction from scratch on whatever
expression is submitted.

---

## 1. Project Objective
Let a user type a Regular Expression and automatically:
1. Validate it
2. Convert it to postfix notation
3. Build an NFA (Thompson's Construction)
4. Show the NFA transition table
5. Draw an interactive NFA graph
6. Convert the NFA to a DFA (Subset Construction)
7. Show the DFA transition table
8. Draw an interactive DFA graph
9. Show a conversion summary

## 2. Features
- Dynamic — works for **any** supported regular expression, not just one example
- Automatic explicit-concatenation insertion (`ab` → `a.b`)
- Full operator precedence handling: `*`/`+`/`?` > `.` > `|`, plus parentheses
- Friendly error messages for empty input, unbalanced parentheses, and bad syntax
- Interactive, zoomable/pannable NFA & DFA graphs (React Flow) — no static images
- DFA state → NFA state-set mapping (e.g. `A = {q0, q1, q3}`)
- Clean, modern, card-based, responsive UI

## 3. Technology Stack
**Frontend:** React 18, Vite, React Flow (graphs), Axios, React Icons, plain CSS
**Backend:** Python 3, Flask, Flask-CORS
**Automata:** Custom Python implementation of Thompson's Construction & Subset Construction (no external automata libraries)

## 4. Project Structure
```
finite-automata-generator/
│
├── backend/
│   ├── app.py
│   ├── automata/
│   │   ├── __init__.py
│   │   ├── regex_parser.py
│   │   ├── nfa.py
│   │   └── dfa.py
│   ├── requirements.txt
│   └── README.md
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── App.css
│       ├── components/
│       │   ├── Header.jsx
│       │   ├── RegexInput.jsx
│       │   ├── Summary.jsx
│       │   ├── NFATable.jsx
│       │   ├── NFAGraph.jsx
│       │   ├── DFATable.jsx
│       │   ├── DFAGraph.jsx
│       │   ├── Pipeline.jsx
│       │   └── graphLayout.js
│       └── services/
│           └── api.js
│
└── README.md   (this file)
```

## 5. Installation & Running

### Backend (Terminal 1)
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```
Backend runs at **http://localhost:5000**.

### Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at **http://localhost:5173** (Vite's default). Open that URL in your browser.

> Both servers must be running at the same time. The frontend calls the backend at
> `http://localhost:5000` — see `frontend/src/services/api.js` if you need to change the port.

## 6. Supported Operators
| Operator | Meaning |
|---|---|
| `\|` | Union / alternation |
| `.` | Concatenation (inserted automatically — you can type `ab` instead of `a.b`) |
| `*` | Kleene star (zero or more) |
| `+` | One or more |
| `?` | Optional (zero or one) |
| `( )` | Grouping |

Operator precedence (highest to lowest): `* + ?` → `.` → `|`

## 7. Example Inputs
```
(a|b)*abb
a(b|c)*
(a|b)+
(a|b)?c
ab*
(a|b)*
```

## 8. How It Works
1. User enters a Regular Expression and clicks **Generate Automata**.
2. The backend validates it, inserts explicit concatenation, and converts it to postfix.
3. **Thompson's Construction** builds the NFA fragment by fragment from the postfix tokens.
4. **Subset Construction** converts that NFA into a DFA: each DFA state represents a *set*
   of NFA states (found via epsilon-closure and `move()` on each input symbol).
5. The backend returns everything as JSON; the React frontend renders the tables and draws
   both graphs live with React Flow.

### Thompson's Construction (brief)
Every symbol becomes a 2-state fragment (`start --symbol--> accept`). The operators glue
fragments together with epsilon (`ε`) transitions:
- `.` (concat) — fragment A's accept links via ε to fragment B's start
- `\|` (union) — new start/accept states, ε branches to both fragments, both join to the new accept
- `*` (star) — new start/accept forming a loop that can also be skipped entirely
- `+` (plus) — must pass through the fragment once, then may loop
- `?` (optional) — new start/accept with an ε path that skips the fragment

### Subset Construction (brief)
Starting from `epsilon_closure({nfa_start})` as the first DFA state, repeatedly compute
`epsilon_closure(move(current_states, symbol))` for every symbol in the alphabet. Any new
set of NFA states becomes a new DFA state. A DFA state is accepting if its NFA-state set
contains the NFA's accepting state.

## 9. API Documentation
See `backend/README.md` for the full `POST /api/convert` request/response schema and the
`GET /api/health` check.

## 10. Test Cases

| Input | Expected result |
|---|---|
| `(a|b)*abb` | Valid — NFA 14 states, DFA 5 states, alphabet `{a, b}` |
| `a(b|c)*` | Valid — NFA 10 states, DFA 4 states, alphabet `{a, b, c}` |
| `(a|b)+` | Valid — NFA 8 states, DFA 3 states |
| `(a|b)?c` | Valid — NFA 10 states, DFA 4 states |
| `ab*` | Valid — NFA 6 states, DFA 3 states |
| `(a|b` | Error: "Invalid Regular Expression: Check your parentheses." |
| *(empty)* | Error: "Please enter a Regular Expression." |

(These were verified against Python's own `re` module and by executing the Flask API with
Flask's test client before delivery — see the automated backend tests described below.)

## 11. Future Enhancements
- String-matching simulator (type a string, watch it walk through the DFA)
- DFA minimization step (Hopcroft/Myhill-Nerode)
- Export NFA/DFA graphs as PNG/SVG
- Support multi-character tokens / a richer alphabet
- Dark mode

---

## Project Viva — 15 Questions & Short Answers

1. **What is a Regular Expression?** A pattern made of symbols and operators (`|`, `*`,
   `+`, `?`, parentheses) that describes a set of strings.
2. **What is an NFA?** A Non-deterministic Finite Automaton — a state machine where one
   input can lead to multiple next states, and free "epsilon" moves are allowed.
3. **What is a DFA?** A Deterministic Finite Automaton — exactly one transition per
   symbol per state, and no epsilon moves.
4. **Difference between NFA and DFA?** NFA allows multiple transitions per symbol and
   epsilon moves; DFA has exactly one transition per symbol and no epsilon moves.
5. **What is Thompson's Construction?** An algorithm that builds an NFA directly from a
   postfix regular expression by combining small fragments with epsilon transitions.
6. **Why do we use Thompson's Construction?** It gives a simple, mechanical, always-correct
   way to turn any regular expression into an NFA.
7. **What is an epsilon transition?** A transition a machine can take without reading any
   input symbol.
8. **What is epsilon closure?** The set of all states reachable from a state (or set of
   states) using only epsilon transitions.
9. **What is Subset Construction?** The algorithm that converts an NFA into an equivalent
   DFA, where each DFA state represents a set of NFA states.
10. **Why is an NFA converted to a DFA?** A DFA is simpler and faster to simulate — one
    active state at a time, one transition per symbol — which matters for real lexers.
11. **What is the role of React Flow / Graphviz-style visualization here?** It takes the
    states/transitions produced by the backend and automatically draws them as an
    interactive directed graph, with zero manual positioning.
12. **Why is postfix notation used?** Postfix has no parentheses or precedence ambiguity,
    so it can be processed with a simple left-to-right stack scan — exactly what
    Thompson's Construction needs.
13. **What operators are supported?** `|`, `.` (concatenation, usually automatic), `*`,
    `+`, `?`, and parentheses for grouping.
14. **How is the DFA generated dynamically?** The same `subset_construction()` function
    runs on whatever NFA was just built from the user's expression — it never assumes a
    fixed number of states or symbols.
15. **What is the main objective of this project?** To let a user type any supported
    regular expression and see, step by step, how it becomes an NFA (Thompson's
    Construction) and then a DFA (Subset Construction), with live tables and interactive
    graphs — nothing hand-drawn or hard-coded.
