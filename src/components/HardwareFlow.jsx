export default function HardwareFlow({ arduinoPacket, esp32Packet }) {
  return (
    <section className="panel hardware-panel">
      <div className="panel-head">
        <h2>Hardware Communication</h2>
        <p>Simulated Arduino → ESP32 → proctoring software path</p>
      </div>
      <ol className="arch-flow">
        <li>Arduino UNO</li>
        <li>Serial Communication</li>
        <li>ESP32</li>
        <li>Wi-Fi / WebSocket</li>
        <li>Exam Proctoring System</li>
      </ol>
      <div className="packet-pair">
        <div>
          <h3 className="subhead">Arduino packet</h3>
          <pre className="packet-block">{JSON.stringify(arduinoPacket, null, 2)}</pre>
        </div>
        <div>
          <h3 className="subhead">ESP32 forwarded packet</h3>
          <pre className="packet-block">{JSON.stringify(esp32Packet, null, 2)}</pre>
        </div>
      </div>
    </section>
  )
}
