export default function AiVisionPanel({ state, onVision }) {
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>AI Vision</h2>
        <p>Simulated computer-vision events</p>
      </div>

      <div className="ai-grid">
        <Badge ok={state.facePresent} label="Face" value={state.facePresent ? 'Present' : 'Missing'} />
        <Badge ok={!state.phoneDetected} label="Phone" value={state.phoneDetected ? 'Detected' : 'Clear'} />
        <Badge ok={!state.secondPerson} label="People" value={state.secondPerson ? 'Second person' : 'Only candidate'} />
        <Badge ok={!state.lookingAway} label="Gaze" value={state.lookingAway ? 'Looking away' : 'Looking normal'} />
      </div>

      <div className="sensor-block">
        <div className="btn-row">
          <button type="button" onClick={() => onVision({ facePresent: false })}>Face Missing</button>
          <button type="button" onClick={() => onVision({ facePresent: true })}>Face Restored</button>
        </div>
        <div className="btn-row">
          <button type="button" onClick={() => onVision({ phoneDetected: true })}>Phone Detected</button>
          <button type="button" onClick={() => onVision({ phoneDetected: false })}>Phone Removed</button>
        </div>
        <div className="btn-row">
          <button type="button" onClick={() => onVision({ secondPerson: true })}>Second Person</button>
          <button type="button" onClick={() => onVision({ secondPerson: false })}>Only Candidate</button>
        </div>
        <div className="btn-row">
          <button type="button" onClick={() => onVision({ lookingAway: true })}>Looking Away</button>
          <button type="button" onClick={() => onVision({ lookingAway: false })}>Looking Normal</button>
        </div>
      </div>
    </section>
  )
}

function Badge({ ok, label, value }) {
  return (
    <div className={`ai-badge ${ok ? 'ok' : 'warn'}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}
