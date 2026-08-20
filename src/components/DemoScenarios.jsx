import { DEMO_SCENARIOS } from '../logic/constants.js'

export default function DemoScenarios({ onScenario }) {
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Demo Scenarios</h2>
        <p>One-click states for a live walkthrough</p>
      </div>
      <div className="scenario-list">
        {Object.values(DEMO_SCENARIOS).map((scenario) => (
          <button
            key={scenario.id}
            type="button"
            className="scenario-btn"
            onClick={() => onScenario(scenario.id)}
          >
            <strong>{scenario.title}</strong>
            <span>{scenario.description}</span>
            <em>Expected score: {scenario.expectedScore}</em>
          </button>
        ))}
      </div>
    </section>
  )
}
