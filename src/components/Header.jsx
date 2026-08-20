export default function Header() {
  return (
    <header className="site-header">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true" />
        <div>
          <p className="eyebrow">Exam Integrity Command Deck</p>
          <h1>AI + IoT Exam Proctor</h1>
        </div>
      </div>
      <div className="header-status">
        <span className="live-pill">
          <span className="live-dot" />
          LIVE SIMULATION
        </span>
        <div className="link-pills">
          <StatusPill name="Arduino UNO" />
          <StatusPill name="ESP32" />
          <StatusPill name="AI Vision" />
        </div>
      </div>
    </header>
  )
}

function StatusPill({ name }) {
  return (
    <span className="status-pill">
      <span className="status-dot" />
      <span className="status-name">{name}</span>
      <span className="status-value">Connected</span>
    </span>
  )
}
