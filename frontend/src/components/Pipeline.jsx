import React from 'react'
import { FaArrowDown } from 'react-icons/fa'

const STEPS = [
  'Regular Expression',
  'Postfix Expression',
  "Thompson's Construction",
  'NFA',
  'Subset Construction',
  'DFA',
]

export default function Pipeline() {
  return (
    <section className="card pipeline-card">
      <h2 className="section-title">Conversion Pipeline</h2>
      <div className="pipeline-list">
        {STEPS.map((step, i) => (
          <React.Fragment key={step}>
            <div className="pipeline-step">{step}</div>
            {i < STEPS.length - 1 && <FaArrowDown className="pipeline-arrow" />}
          </React.Fragment>
        ))}
      </div>
    </section>
  )
}
