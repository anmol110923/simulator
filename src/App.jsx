import { useMemo, useReducer } from 'react'
import Header from './components/Header.jsx'
import DeskVisualization from './components/DeskVisualization.jsx'
import ArduinoPanel from './components/ArduinoPanel.jsx'
import Esp32Panel from './components/Esp32Panel.jsx'
import AiVisionPanel from './components/AiVisionPanel.jsx'
import IntegrityScore from './components/IntegrityScore.jsx'
import SensorFusion from './components/SensorFusion.jsx'
import EventLog from './components/EventLog.jsx'
import DemoScenarios from './components/DemoScenarios.jsx'
import HardwareFlow from './components/HardwareFlow.jsx'
import { computeIntegrityScore, getDetectedStatus, getRiskLevel, getActiveRiskFactors } from './logic/scoring.js'
import {
  applyDemoScenario,
  appReducer,
  buildArduinoPacket,
  buildEsp32Packet,
  createInitialState,
  hardwarePatchFromControls,
  processHardwarePacket,
  processVisionUpdate,
} from './logic/simulator.js'

function App() {
  const [state, dispatch] = useReducer(appReducer, undefined, createInitialState)

  const score = useMemo(() => computeIntegrityScore(state), [state])
  const risk = useMemo(() => getRiskLevel(score), [score])
  const factors = useMemo(() => getActiveRiskFactors(state), [state])
  const detected = useMemo(() => getDetectedStatus(state), [state])
  const arduinoPacket = useMemo(() => buildArduinoPacket(state), [state])
  const esp32Packet = useMemo(() => buildEsp32Packet(state), [state])

  const onHardwareControl = (control) => {
    const packet = hardwarePatchFromControls(state, control)
    processHardwarePacket(packet, dispatch)
  }

  const onVision = (patch) => {
    processVisionUpdate(patch, dispatch)
  }

  const onScenario = (scenarioId) => {
    applyDemoScenario(scenarioId, dispatch)
  }

  return (
    <div className="app-shell">
      <Header />
      <main className="dashboard">
        <DeskVisualization state={state} />
        <IntegrityScore score={score} risk={risk} />
        <ArduinoPanel state={state} onControl={onHardwareControl} />
        <Esp32Panel
          packet={esp32Packet}
          packetsReceived={state.packetsReceived}
          packetsSent={state.packetsSent}
          lastEvent={state.lastEvent}
          wifiStatus={state.wifiStatus}
        />
        <AiVisionPanel state={state} onVision={onVision} />
        <SensorFusion score={score} detected={detected} factors={factors} />
        <HardwareFlow arduinoPacket={arduinoPacket} esp32Packet={esp32Packet} />
        <DemoScenarios onScenario={onScenario} />
        <EventLog events={state.events} />
      </main>
    </div>
  )
}

export default App
