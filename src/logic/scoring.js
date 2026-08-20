import {
  DISTANCE_RESTRICTED_CM,
  MAX_SCORE,
  RISK_LEVELS,
  WEIGHTS,
} from './constants.js'

export function getActiveRiskFactors(state) {
  const factors = []

  if (!state.facePresent) {
    factors.push({ id: 'faceMissing', label: 'Face missing', points: WEIGHTS.faceMissing })
  }
  if (state.lookingAway) {
    factors.push({ id: 'lookingAway', label: 'Looking away', points: WEIGHTS.lookingAway })
  }
  if (state.motion) {
    factors.push({
      id: 'pirMotion',
      label: 'PIR unusual movement',
      points: WEIGHTS.pirMotion,
    })
  }
  if (state.distance < DISTANCE_RESTRICTED_CM) {
    factors.push({
      id: 'ultrasonicRestricted',
      label: 'Ultrasonic restricted-zone object',
      points: WEIGHTS.ultrasonicRestricted,
    })
  }
  if (state.vibration) {
    factors.push({
      id: 'vibration',
      label: 'Abnormal vibration',
      points: WEIGHTS.vibration,
    })
  }
  if (state.rfidDetected && !state.rfidAuthorized) {
    factors.push({
      id: 'unauthorizedRfid',
      label: 'Unauthorized RFID',
      points: WEIGHTS.unauthorizedRfid,
    })
  }
  if (state.phoneDetected) {
    factors.push({
      id: 'phoneDetected',
      label: 'Phone detected',
      points: WEIGHTS.phoneDetected,
    })
  }
  if (state.secondPerson) {
    factors.push({
      id: 'secondPerson',
      label: 'Second person detected',
      points: WEIGHTS.secondPerson,
    })
  }

  return factors
}

export function computeIntegrityScore(state) {
  const total = getActiveRiskFactors(state).reduce((sum, factor) => sum + factor.points, 0)
  return Math.min(total, MAX_SCORE)
}

export function getRiskLevel(score) {
  const level = RISK_LEVELS.find((entry) => score <= entry.max) ?? RISK_LEVELS[RISK_LEVELS.length - 1]
  return level
}

export function getDetectedStatus(state) {
  return [
    {
      ok: state.rfidDetected && state.rfidAuthorized,
      label: 'RFID',
      detail: !state.rfidDetected
        ? 'Candidate not present'
        : state.rfidAuthorized
          ? 'Candidate authenticated'
          : 'Unauthorized tag',
    },
    {
      ok: state.facePresent,
      label: 'Face',
      detail: state.facePresent ? 'Present' : 'Missing',
    },
    {
      ok: !state.phoneDetected,
      label: 'Phone',
      detail: state.phoneDetected ? 'Detected' : 'Not detected',
    },
    {
      ok: !state.secondPerson,
      label: 'Second person',
      detail: state.secondPerson ? 'Detected' : 'Only candidate',
    },
    {
      ok: !state.lookingAway,
      label: 'Gaze',
      detail: state.lookingAway ? 'Looking away' : 'Looking normal',
    },
    {
      ok: state.distance >= DISTANCE_RESTRICTED_CM,
      label: 'Distance',
      detail: state.distance >= DISTANCE_RESTRICTED_CM ? 'Normal' : `Restricted (${state.distance} cm)`,
    },
    {
      ok: !state.motion,
      label: 'PIR',
      detail: state.motion ? 'Motion detected' : 'Normal',
    },
    {
      ok: !state.vibration,
      label: 'Vibration',
      detail: state.vibration ? 'Abnormal' : 'Normal',
    },
  ]
}
