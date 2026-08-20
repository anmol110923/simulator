export default function ArduinoPanel({ state, onControl }) {
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Arduino UNO Sensors</h2>
        <p>RC522 · HC-SR04 · PIR · Vibration</p>
      </div>

      <div className="sensor-block">
        <div className="sensor-meta">
          <span>RFID</span>
          <strong className={state.rfidDetected ? 'ok' : 'warn'}>
            {state.rfidDetected ? 'Candidate Present' : 'Not Present'}
          </strong>
          <em className={state.rfidDetected && state.rfidAuthorized ? 'ok' : 'warn'}>
            {!state.rfidDetected
              ? 'No tag'
              : state.rfidAuthorized
                ? 'Authorized'
                : 'Unauthorized'}
          </em>
        </div>
        <div className="btn-row">
          <button type="button" onClick={() => onControl('rfid-remove')}>Remove RFID</button>
          <button type="button" onClick={() => onControl('rfid-restore')}>Restore RFID</button>
        </div>
        <div className="btn-row">
          <button type="button" onClick={() => onControl('rfid-unauthorized')}>Unauthorized</button>
          <button type="button" onClick={() => onControl('rfid-authorized')}>Authorized</button>
        </div>
      </div>

      <div className="sensor-block">
        <div className="sensor-meta">
          <span>Ultrasonic</span>
          <strong>{state.distance} cm</strong>
          <em className={state.distance < 30 ? 'warn' : 'ok'}>
            {state.distance < 30 ? 'Restricted zone' : 'Normal distance'}
          </em>
        </div>
        <div className="btn-row">
          <button type="button" onClick={() => onControl('distance-close')}>Move Object Closer</button>
          <button type="button" onClick={() => onControl('distance-normal')}>Normal Distance</button>
        </div>
      </div>

      <div className="sensor-block">
        <div className="sensor-meta">
          <span>PIR</span>
          <strong className={state.motion ? 'warn' : 'ok'}>
            {state.motion ? 'Motion Detected' : 'No Motion'}
          </strong>
        </div>
        <div className="btn-row">
          <button type="button" onClick={() => onControl('motion-on')}>Trigger Motion</button>
          <button type="button" onClick={() => onControl('motion-off')}>Stop Motion</button>
        </div>
      </div>

      <div className="sensor-block">
        <div className="sensor-meta">
          <span>Vibration</span>
          <strong className={state.vibration ? 'warn' : 'ok'}>
            {state.vibration ? 'Abnormal' : 'Normal'}
          </strong>
        </div>
        <div className="btn-row">
          <button type="button" onClick={() => onControl('vibration-on')}>Shake Desk</button>
          <button type="button" onClick={() => onControl('vibration-off')}>Normal</button>
        </div>
      </div>
    </section>
  )
}
