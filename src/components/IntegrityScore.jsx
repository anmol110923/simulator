export default function IntegrityScore({ score, risk }) {
  const angle = (score / 100) * 270 - 135

  return (
    <section className={`panel score-panel risk-${risk.id}`}>
      <div className="panel-head">
        <h2>Exam Integrity Score</h2>
        <p>Live fusion of sensors + AI</p>
      </div>
      <div className="score-ring">
        <div className="score-value" style={{ '--needle': `${angle}deg` }}>
          <span>{score}</span>
          <small>/ 100</small>
        </div>
        <div className={`risk-chip risk-${risk.id}`}>{risk.label}</div>
      </div>
      <ul className="risk-legend">
        <li>0–19 NORMAL</li>
        <li>20–39 WATCH</li>
        <li>40–59 SUSPICIOUS</li>
        <li>60–79 HIGH RISK</li>
        <li>80–100 CRITICAL</li>
      </ul>
    </section>
  )
}
