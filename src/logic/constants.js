export const DISTANCE_RESTRICTED_CM = 30
export const DISTANCE_NORMAL_CM = 54
export const DISTANCE_CLOSE_CM = 20
export const MAX_SCORE = 100
export const MAX_LOG_ENTRIES = 50

export const WEIGHTS = {
  faceMissing: 10,
  lookingAway: 10,
  pirMotion: 10,
  ultrasonicRestricted: 15,
  vibration: 15,
  unauthorizedRfid: 25,
  phoneDetected: 30,
  secondPerson: 40,
}

export const RISK_LEVELS = [
  { max: 19, id: 'normal', label: 'NORMAL' },
  { max: 39, id: 'watch', label: 'WATCH' },
  { max: 59, id: 'suspicious', label: 'SUSPICIOUS' },
  { max: 79, id: 'high', label: 'HIGH RISK' },
  { max: 100, id: 'critical', label: 'CRITICAL' },
]

export const INITIAL_SENSOR_STATE = {
  rfidDetected: true,
  rfidAuthorized: true,
  distance: DISTANCE_NORMAL_CM,
  motion: false,
  vibration: false,
  facePresent: true,
  phoneDetected: false,
  secondPerson: false,
  lookingAway: false,
}

export const DEMO_SCENARIOS = {
  normal: {
    id: 'normal',
    title: 'Normal Exam',
    description: 'Authenticated candidate. All sensors and AI channels clear.',
    expectedScore: 0,
    state: { ...INITIAL_SENSOR_STATE },
  },
  phone: {
    id: 'phone',
    title: 'Phone Cheating',
    description: 'Phone detected. Face present. Hardware otherwise normal.',
    expectedScore: 30,
    state: {
      ...INITIAL_SENSOR_STATE,
      phoneDetected: true,
    },
  },
  suspicious: {
    id: 'suspicious',
    title: 'Suspicious Activity',
    description: 'Face missing, looking away, vibration, restricted distance.',
    expectedScore: 50,
    state: {
      ...INITIAL_SENSOR_STATE,
      facePresent: false,
      lookingAway: true,
      vibration: true,
      distance: DISTANCE_CLOSE_CM,
    },
  },
  critical: {
    id: 'critical',
    title: 'Critical Cheating',
    description: 'Unauthorized RFID, phone, second person, face missing, vibration.',
    expectedScore: 100,
    state: {
      ...INITIAL_SENSOR_STATE,
      rfidDetected: true,
      rfidAuthorized: false,
      phoneDetected: true,
      secondPerson: true,
      facePresent: false,
      vibration: true,
    },
  },
}
