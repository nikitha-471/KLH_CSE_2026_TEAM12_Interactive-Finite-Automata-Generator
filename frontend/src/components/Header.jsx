import React from 'react'
import { FaProjectDiagram } from 'react-icons/fa'

export default function Header() {
  return (
    <header className="app-header">
      <div className="app-header-inner">
        <FaProjectDiagram className="app-header-icon" />
        <div>
          <h1>Interactive Finite Automata Generator</h1>
          <p className="app-subtitle">
            Convert Regular Expressions into NFA and DFA using Thompson's Construction and Subset Construction.
          </p>
        </div>
      </div>
    </header>
  )
}
