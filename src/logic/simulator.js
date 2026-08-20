import {
  DEMO_SCENARIOS,
  DISTANCE_NORMAL_CM,
  INITIAL_SENSOR_STATE,
  MAX_LOG_ENTRIES,
} from './constants.js'
import { computeIntegrityScore } from './scoring.js'

let eventSeq = 0

export function createInitialState() {
  return {
    ...INITIAL_SENSOR_STATE,
    packetsReceived: 0,
    packetsSent: 0,
    lastEvent: 'System initialized',
    wifiStatus: 'Connected',
    events: [
      makeEvent('INFO', 'Simulation online — Arduino UNO, ESP32, and AI Vision connected'),
    ],
  }
}

export function buildArduinoPacket(state) {
  return {
    device: 'arduino_uno',
    timestamp: new Date().toISOString(),
    rfid: {
      detected: state.rfidDetected,
      authorized: state.rfidAuthorized,
    },
    ultrasonic: {
      distance: state.distance,
    },
    pir: {
      motion: state.motion,
    },
    vibration: {
      detected: state.vibration,
    },
  }
}

export function buildEsp32Packet(state) {
  return {
    rfid: state.rfidDetected,
    distance: state.distance,
    pir: state.motion,
    vibration: state.vibration,
  }
}

export function normalizeHardwarePacket(packet) {
  if (!packet || typeof packet !== 'object') {
    return {}
  }

  const next = {}

  if (packet.device === 'arduino_uno' || packet.rfid?.detected !== undefined) {
    if (packet.rfid) {
      if (typeof packet.rfid.detected === 'boolean') next.rfidDetected = packet.rfid.detected
      if (typeof packet.rfid.authorized === 'boolean') next.rfidAuthorized = packet.rfid.authorized
    }
    if (packet.ultrasonic && typeof packet.ultrasonic.distance === 'number') {
      next.distance = packet.ultrasonic.distance
    }
    if (packet.pir && typeof packet.pir.motion === 'boolean') {
      next.motion = packet.pir.motion
    }
    if (packet.vibration && typeof packet.vibration.detected === 'boolean') {
      next.vibration = packet.vibration.detected
    }
  } else {
    if (typeof packet.rfid === 'boolean') next.rfidDetected = packet.rfid
    if (typeof packet.authorized === 'boolean') next.rfidAuthorized = packet.authorized
    if (typeof packet.distance === 'number') next.distance = packet.distance
    if (typeof packet.pir === 'boolean') next.motion = packet.pir
    if (typeof packet.vibration === 'boolean') next.vibration = packet.vibration
  }

  if (typeof packet.facePresent === 'boolean') next.facePresent = packet.facePresent
  if (typeof packet.phoneDetected === 'boolean') next.phoneDetected = packet.phoneDetected
  if (typeof packet.secondPerson === 'boolean') next.secondPerson = packet.secondPerson
  if (typeof packet.lookingAway === 'boolean') next.lookingAway = packet.lookingAway

  return next
}

/**
 * Unified ingest for the browser simulator and future ESP32/WebSocket/MQTT data.
 * Later a real connection can call: processHardwarePacket(packet, dispatch)
 */
export function processHardwarePacket(packet, dispatch) {
  dispatch({ type: 'HARDWARE', packet })
}

export function processVisionUpdate(patch, dispatch) {
  dispatch({ type: 'VISION', patch })
}

export function applyDemoScenario(scenarioId, dispatch) {
  dispatch({ type: 'SCENARIO', scenarioId })
}

export function appReducer(state, action) {
  switch (action.type) {
    case 'HARDWARE': {
      const patch = normalizeHardwarePacket(action.packet)
      const merged = { ...state, ...patch }
      const next = {
        ...merged,
        packetsReceived: state.packetsReceived + 1,
        packetsSent: state.packetsSent + 1,
      }
      return withDerivedEvents(state, next, 'hardware')
    }
    case 'VISION': {
      const next = { ...state, ...action.patch }
      return withDerivedEvents(state, next, 'vision')
    }
    case 'SCENARIO': {
      const scenario = DEMO_SCENARIOS[action.scenarioId]
      if (!scenario) return state
      const next = {
        ...state,
        ...scenario.state,
        packetsReceived: state.packetsReceived + 1,
        packetsSent: state.packetsSent + 1,
      }
      return withDerivedEvents(state, next, 'scenario', scenario.title)
    }
    default:
      return state
  }
}

function withDerivedEvents(prev, next, source, scenarioTitle) {
  const logs = []

  if (source === 'scenario') {
    logs.push(makeEvent('INFO', `Demo scenario applied: ${scenarioTitle}`))
  }

  logs.push(...diffSensorEvents(prev, next))

  const prevScore = computeIntegrityScore(prev)
  const nextScore = computeIntegrityScore(next)

  if (prevScore < 60 && nextScore >= 60) {
    logs.push(makeEvent('CRITICAL', 'Exam integrity score exceeded 60'))
  }
  if (prevScore < 80 && nextScore >= 80) {
    logs.push(makeEvent('CRITICAL', 'Exam integrity score exceeded 80'))
  }

  const lastEvent = logs[0]?.message ?? next.lastEvent

  return {
    ...next,
    lastEvent,
    events: [...logs, ...prev.events].slice(0, MAX_LOG_ENTRIES),
  }
}

function diffSensorEvents(prev, next) {
  const events = []

  if (prev.rfidDetected !== next.rfidDetected) {
    events.push(
      next.rfidDetected
        ? makeEvent('INFO', 'RFID candidate present')
        : makeEvent('WARNING', 'RFID candidate removed from reader'),
    )
  }

  if (prev.rfidAuthorized !== next.rfidAuthorized && next.rfidDetected) {
    events.push(
      next.rfidAuthorized
        ? makeEvent('INFO', 'RFID candidate authenticated')
        : makeEvent('CRITICAL', 'Unauthorized RFID detected'),
    )
  } else if (
    !prev.rfidDetected &&
    next.rfidDetected &&
    next.rfidAuthorized
  ) {
    events.push(makeEvent('INFO', 'RFID candidate authenticated'))
  }

  if (prev.distance !== next.distance) {
    if (next.distance < 30) {
      events.push(
        makeEvent('WARNING', `Ultrasonic restricted-zone object at ${next.distance} cm`),
      )
    } else {
      events.push(makeEvent('INFO', `Ultrasonic distance restored to ${next.distance} cm`))
    }
  }

  if (prev.motion !== next.motion) {
    events.push(
      next.motion
        ? makeEvent('WARNING', 'PIR unusual movement detected')
        : makeEvent('INFO', 'PIR motion cleared'),
    )
  }

  if (prev.vibration !== next.vibration) {
    events.push(
      next.vibration
        ? makeEvent('WARNING', 'Abnormal desk vibration detected')
        : makeEvent('INFO', 'Vibration returned to normal'),
    )
  }

  if (prev.facePresent !== next.facePresent) {
    events.push(
      next.facePresent
        ? makeEvent('INFO', 'Face restored')
        : makeEvent('WARNING', 'Face not detected'),
    )
  }

  if (prev.phoneDetected !== next.phoneDetected) {
    events.push(
      next.phoneDetected
        ? makeEvent('WARNING', 'Phone detected by AI')
        : makeEvent('INFO', 'Phone removed from view'),
    )
  }

  if (prev.secondPerson !== next.secondPerson) {
    events.push(
      next.secondPerson
        ? makeEvent('CRITICAL', 'Second person detected')
        : makeEvent('INFO', 'Only candidate in frame'),
    )
  }

  if (prev.lookingAway !== next.lookingAway) {
    events.push(
      next.lookingAway
        ? makeEvent('WARNING', 'Candidate looking away')
        : makeEvent('INFO', 'Gaze returned to screen'),
    )
  }

  return events
}

function makeEvent(severity, message) {
  const now = new Date()
  return {
    id: `evt-${Date.now()}-${eventSeq++}`,
    timestamp: now.toLocaleTimeString('en-GB', { hour12: false }),
    iso: now.toISOString(),
    severity,
    message,
  }
}

export function hardwarePatchFromControls(state, control) {
  switch (control) {
    case 'rfid-remove':
      return buildArduinoPacket({ ...state, rfidDetected: false })
    case 'rfid-restore':
      return buildArduinoPacket({ ...state, rfidDetected: true, rfidAuthorized: true })
    case 'rfid-unauthorized':
      return buildArduinoPacket({ ...state, rfidDetected: true, rfidAuthorized: false })
    case 'rfid-authorized':
      return buildArduinoPacket({ ...state, rfidDetected: true, rfidAuthorized: true })
    case 'distance-close':
      return buildArduinoPacket({ ...state, distance: 20 })
    case 'distance-normal':
      return buildArduinoPacket({ ...state, distance: DISTANCE_NORMAL_CM })
    case 'motion-on':
      return buildArduinoPacket({ ...state, motion: true })
    case 'motion-off':
      return buildArduinoPacket({ ...state, motion: false })
    case 'vibration-on':
      return buildArduinoPacket({ ...state, vibration: true })
    case 'vibration-off':
      return buildArduinoPacket({ ...state, vibration: false })
    default:
      return buildArduinoPacket(state)
  }
}
