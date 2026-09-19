import React, { useState } from 'react'
import { FaPlay } from 'react-icons/fa'

const EXAMPLES = ['(a|b)*abb', 'a(b|c)*', '(a|b)+', '(a|b)?c']

const OPERATORS = [
  { symbol: '|', meaning: 'Union' },
  { symbol: '.', meaning: 'Concatenation (usually automatic)' },
  { symbol: '*', meaning: 'Kleene Star (zero or more)' },
  { symbol: '+', meaning: 'One or more' },
  { symbol: '?', meaning: 'Optional (zero or one)' },
  { symbol: '( )', meaning: 'Grouping / Parentheses' },
]

export default function RegexInput({ value, onChange, onGenerate, loading }) {
  const [localValue, setLocalValue] = useState(value)

  const handleChange = (e) => {
    setLocalValue(e.target.value)
    onChange(e.target.value)
  }

  const handleExampleClick = (example) => {
    setLocalValue(example)
    onChange(example)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onGenerate()
    }
  }

  return (
    <section className="card input-card">
      <label className="input-label" htmlFor="regex-input">
        Enter Regular Expression
      </label>
      <div className="input-row">
        <input
          id="regex-input"
          type="text"
          className="regex-input"
          placeholder="(a|b)*abb"
          value={localValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <button className="generate-btn" onClick={onGenerate} disabled={loading}>
          {loading ? (
            <span className="spinner" aria-label="Loading" />
          ) : (
            <>
              <FaPlay style={{ marginRight: 8 }} />
              Generate Automata
            </>
          )}
        </button>
      </div>

      <div className="examples-row">
        <span className="examples-label">Examples:</span>
        {EXAMPLES.map((ex) => (
          <button key={ex} className="example-chip" onClick={() => handleExampleClick(ex)}>
            {ex}
          </button>
        ))}
      </div>

      <div className="operators-box">
        <span className="operators-title">Supported Operators</span>
        <div className="operators-grid">
          {OPERATORS.map((op) => (
            <div className="operator-item" key={op.symbol}>
              <code>{op.symbol}</code>
              <span>{op.meaning}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
