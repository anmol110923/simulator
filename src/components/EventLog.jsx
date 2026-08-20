export default function EventLog({ events }) {
  return (
    <section className="panel log-panel">
      <div className="panel-head">
        <h2>Event Log</h2>
        <p>Newest events first</p>
      </div>
      <ol className="event-list">
        {events.map((event) => (
          <li key={event.id} className={`sev-${event.severity.toLowerCase()}`}>
            <time>{event.timestamp}</time>
            <span className="sev">{event.severity}</span>
            <p>{event.message}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
