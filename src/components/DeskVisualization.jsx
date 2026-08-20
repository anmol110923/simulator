export default function DeskVisualization({ state }) {
  const rfidAlert = !state.rfidDetected || !state.rfidAuthorized
  const ultraAlert = state.distance < 30
  const pirAlert = state.motion
  const vibAlert = state.vibration
  const aiAlert = !state.facePresent || state.phoneDetected || state.secondPerson || state.lookingAway

  return (
    <section className="panel desk-panel">
      <div className="panel-head">
        <h2>Candidate Desk</h2>
        <p>2D schematic of the exam station and sensor placement</p>
      </div>
      <div className="desk-stage">
        <svg viewBox="0 0 640 320" role="img" aria-label="Exam desk schematic">
          <defs>
            <linearGradient id="deskFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#1b2a3a" />
              <stop offset="100%" stopColor="#12202c" />
            </linearGradient>
          </defs>
          <rect x="40" y="70" width="560" height="200" rx="18" fill="url(#deskFill)" stroke="#2d4a61" />
          <rect x="70" y="96" width="500" height="12" rx="4" fill="#24384c" />

          <g className={rfidAlert ? 'node-alert' : 'node-ok'}>
            <rect x="86" y="130" width="88" height="58" rx="8" />
            <text x="130" y="155" textAnchor="middle">RFID</text>
            <text x="130" y="173" textAnchor="middle" className="tiny">
              {state.rfidDetected ? (state.rfidAuthorized ? 'AUTH' : 'UNAUTH') : 'ABSENT'}
            </text>
          </g>

          <g className={ultraAlert ? 'node-alert' : 'node-ok'}>
            <rect x="196" y="130" width="108" height="58" rx="8" />
            <text x="250" y="155" textAnchor="middle">ULTRASONIC</text>
            <text x="250" y="173" textAnchor="middle" className="tiny">
              {state.distance} cm
            </text>
          </g>

          <g className={pirAlert ? 'node-alert' : 'node-ok'}>
            <rect x="326" y="130" width="88" height="58" rx="8" />
            <text x="370" y="155" textAnchor="middle">PIR</text>
            <text x="370" y="173" textAnchor="middle" className="tiny">
              {state.motion ? 'MOTION' : 'CLEAR'}
            </text>
          </g>

          <g className={vibAlert ? 'node-alert' : 'node-ok'}>
            <rect x="436" y="130" width="108" height="58" rx="8" />
            <text x="490" y="155" textAnchor="middle">VIBRATION</text>
            <text x="490" y="173" textAnchor="middle" className="tiny">
              {state.vibration ? 'SHAKE' : 'STABLE'}
            </text>
          </g>

          <g className={aiAlert ? 'node-alert' : 'node-ok'}>
            <rect x="196" y="204" width="248" height="48" rx="8" />
            <text x="320" y="225" textAnchor="middle">LAPTOP / CAMERA</text>
            <text x="320" y="242" textAnchor="middle" className="tiny">
              {state.facePresent ? 'FACE LOCK' : 'NO FACE'} · {state.phoneDetected ? 'PHONE' : 'NO PHONE'}
            </text>
          </g>

          <g>
            <circle cx="320" cy="46" r="22" fill="#d8b48a" stroke="#f0d2b0" />
            <rect x="302" y="66" width="36" height="22" rx="8" fill="#3d5a73" />
            <text x="320" y="28" textAnchor="middle" className="tiny candidate-label">
              CANDIDATE{state.secondPerson ? ' + 2ND' : ''}
            </text>
          </g>
        </svg>
      </div>
    </section>
  )
}
