import React from 'react'

export default function Summary({ result }) {
  const { regex, postfix, alphabet, nfa, dfa } = result

  const stats = [
    { label: 'Input Regex', value: regex },
    { label: 'Postfix', value: postfix },
    { label: 'Alphabet', value: `{ ${alphabet.join(', ')} }` },
    { label: 'NFA States', value: nfa.num_states },
    { label: 'DFA States', value: dfa.num_states },
  ]

  return (
    <section className="card summary-card">
      <h2 className="section-title">1. Regular Expression Summary</h2>
      <div className="summary-grid">
        {stats.map((s) => (
          <div className="summary-item" key={s.label}>
            <span className="summary-label">{s.label}</span>
            <span className="summary-value">{String(s.value)}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
