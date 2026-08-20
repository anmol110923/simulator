export default function SensorFusion({ score, detected, factors }) {
  return (
    <section className="panel fusion-panel">
      <div className="panel-head">
        <h2>SENSOR FUSION</h2>
        <p>Why the current integrity score exists</p>
      </div>
      <p className="fusion-score">EXAM INTEGRITY: {score}/100</p>
      <div className="fusion-grid">
        <div>
          <h3 className="subhead">Detected</h3>
          <ul className="fusion-list">
            {detected.map((item) => (
              <li key={item.label} className={item.ok ? 'ok' : 'warn'}>
                <span>{item.ok ? '✓' : '⚠'}</span>
                <strong>{item.label}:</strong> {item.detail}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="subhead">Risk factors</h3>
          {factors.length === 0 ? (
            <p className="muted">No active risk factors. Candidate environment is clear.</p>
          ) : (
            <ul className="factor-list">
              {factors.map((factor) => (
                <li key={factor.id}>
                  {factor.label} <span>(+{factor.points})</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
