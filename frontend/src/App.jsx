import React, { useState } from 'react'
import Header from './components/Header'
import RegexInput from './components/RegexInput'
import Summary from './components/Summary'
import NFATable from './components/NFATable'
import NFAGraph from './components/NFAGraph'
import DFATable from './components/DFATable'
import DFAGraph from './components/DFAGraph'
import Pipeline from './components/Pipeline'
import { convertRegex } from './services/api'

export default function App() {
  const [regex, setRegex] = useState('(a|b)*abb')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleGenerate = async () => {
    setError(null)
    setLoading(true)
    try {
      const data = await convertRegex(regex)
      setResult(data)
    } catch (err) {
      setResult(null)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <Header />

      <main className="app-main">
        <RegexInput value={regex} onChange={setRegex} onGenerate={handleGenerate} loading={loading} />

        {error && (
          <div className="card error-card">
            <strong>Error:</strong> {error}
          </div>
        )}

        {loading && (
          <div className="card loading-card">
            <span className="spinner spinner-large" aria-label="Loading" />
            <span>Generating automata...</span>
          </div>
        )}

        {result && !loading && (
          <>
            <Summary result={result} />

            <section className="card">
              <h2 className="section-title">2. Non-Deterministic Finite Automaton (NFA)</h2>
              <NFATable nfa={result.nfa} />
              <h3 className="subsection-title">NFA Graph</h3>
              <NFAGraph nfa={result.nfa} />
            </section>

            <section className="card">
              <h2 className="section-title">3. Deterministic Finite Automaton (DFA)</h2>
              <DFATable dfa={result.dfa} />
              <h3 className="subsection-title">DFA Graph</h3>
              <DFAGraph dfa={result.dfa} />
            </section>

            <Pipeline />
          </>
        )}
      </main>

      <footer className="app-footer">Compiler Design Project — Interactive Finite Automata Generator</footer>
    </div>
  )
}
