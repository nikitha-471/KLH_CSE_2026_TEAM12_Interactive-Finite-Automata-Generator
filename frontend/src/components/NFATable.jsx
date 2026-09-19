import React from 'react'

export default function NFATable({ nfa }) {
  return (
    <div className="table-wrap">
      <div className="stat-chip-row">
        <span className="stat-chip">States: {nfa.num_states}</span>
        <span className="stat-chip">Start: {nfa.start}</span>
        <span className="stat-chip">Accept: {nfa.accept}</span>
        <span className="stat-chip">Transitions: {nfa.num_transitions}</span>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>From State</th>
            <th>Input</th>
            <th>To State</th>
          </tr>
        </thead>
        <tbody>
          {nfa.transitions.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'row-even' : 'row-odd'}>
              <td>{row.from}</td>
              <td className="symbol-cell">{row.symbol}</td>
              <td>{row.to}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
