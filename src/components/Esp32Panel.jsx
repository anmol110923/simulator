export default function Esp32Panel({ packet, packetsReceived, packetsSent, lastEvent, wifiStatus }) {
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>ESP32 Bridge</h2>
        <p>Serial ingest · Wi-Fi forward</p>
      </div>
      <div className="esp-status">
        <span>ESP32 STATUS</span>
        <strong>ONLINE</strong>
      </div>
      <div className="stat-grid">
        <div>
          <span>Packets received</span>
          <strong>{packetsReceived}</strong>
        </div>
        <div>
          <span>Packets sent</span>
          <strong>{packetsSent}</strong>
        </div>
        <div>
          <span>Wi-Fi</span>
          <strong>{wifiStatus}</strong>
        </div>
      </div>
      <p className="last-event">Last event: {lastEvent}</p>
      <h3 className="subhead">Last received packet</h3>
      <pre className="packet-block">{JSON.stringify(packet, null, 2)}</pre>
    </section>
  )
}
