import React from 'react'

export default function DFATable({ dfa }) {
  const transByState = {}
  dfa.states.forEach((s) => {
    transByState[s] = {}
  })
  dfa.transitions.forEach((t) => {
    transByState[t.from][t.symbol] = t.to
  })

  return (
    <div className="table-wrap">
      <div className="stat-chip-row">
        <span className="stat-chip">States: {dfa.states.join(', ')}</span>
        <span className="stat-chip">Start: {dfa.start}</span>
        <span className="stat-chip">
          Accepting: {dfa.accepting.length ? dfa.accepting.join(', ') : 'None'}
        </span>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>DFA State</th>
            {dfa.alphabet.map((sym) => (
              <th key={sym}>{sym}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dfa.states.map((state, i) => (
            <tr key={state} className={i % 2 === 0 ? 'row-even' : 'row-odd'}>
              <td>
                {state === dfa.start ? '→ ' : ''}
                {dfa.accepting.includes(state) ? '*' : ''}
                {state}
              </td>
              {dfa.alphabet.map((sym) => (
                <td key={sym}>{transByState[state][sym] ?? '—'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="table-note">→ = start state, * = accepting state</p>

      <h4 className="subsection-title">DFA State → NFA State Set Mapping</h4>
      <div className="state-map-list">
        {Object.entries(dfa.state_map).map(([name, members]) => (
          <div className="state-map-item" key={name}>
            <code>
              {name} = {'{'}
              {members.join(', ')}
              {'}'}
            </code>
          </div>
        ))}
      </div>
    </div>
  )
}
