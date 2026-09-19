# Backend — Flask API

Implements the whole `Regular Expression -> Postfix -> Thompson's Construction (NFA) ->
Subset Construction (DFA)` pipeline and exposes it as a REST API.

## Files
- `app.py` — Flask app, exposes `POST /api/convert`
- `automata/regex_parser.py` — validation, explicit concatenation insertion, infix→postfix
- `automata/nfa.py` — `NFAState`, `Fragment`, Thompson's Construction
- `automata/dfa.py` — `epsilon_closure`, `move`, Subset Construction

## Run
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
source venv/bin/activate
pip install -r requirements.txt
python app.py
```
Server runs at `http://localhost:5000`.

## API

### `POST /api/convert`
Request:
```json
{ "regex": "(a|b)*abb" }
```
Response (200):
```json
{
  "regex": "(a|b)*abb",
  "postfix": "ab|*a.b.b.",
  "alphabet": ["a", "b"],
  "nfa": {
    "states": ["q0", "q1", "..."],
    "start": "q0",
    "accept": "q13",
    "num_states": 14,
    "num_transitions": 16,
    "transitions": [{"from": "q0", "symbol": "ε", "to": "q1"}]
  },
  "dfa": {
    "states": ["A", "B", "C", "D", "E"],
    "start": "A",
    "accepting": ["E"],
    "num_states": 5,
    "alphabet": ["a", "b"],
    "transitions": [{"from": "A", "symbol": "a", "to": "B"}],
    "state_map": {"A": ["q0", "q1", "q3"]}
  }
}
```
Error response (400): `{ "error": "Invalid Regular Expression." }`

### `GET /api/health`
Returns `{ "status": "ok" }` — useful to confirm the backend is running.
