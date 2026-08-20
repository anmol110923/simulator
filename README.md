# AI + IoT Exam Proctor Simulator

Browser-only dashboard that demonstrates how Arduino UNO sensors, an ESP32 network bridge, and AI vision events can be fused into a single **Exam Integrity Score**.

No real hardware, cameras, APIs, or backend are required. All sensor and vision events are simulated in React state so the demo runs offline after `npm install`.

## What it does

The dashboard is a live exam-station command deck. You can trigger RFID, ultrasonic, PIR, and vibration events, plus AI detections (missing face, phone, second person, looking away). Each active risk factor contributes points to a 0–100 integrity score. Restoring a sensor to normal removes that contribution.

## System architecture

```text
Arduino UNO  →  Serial Communication  →  ESP32  →  Wi-Fi / WebSocket  →  Exam Proctoring System
```

In this project the entire path is simulated. Hardware packets are JSON objects. When a sensor changes, the Arduino packet updates and the ESP32 “forwards” a compact packet to the dashboard.

## Arduino UNO role

The Arduino is the local sensor hub. It reads:

| Sensor | Role in the demo |
| --- | --- |
| RC522 RFID | Candidate present / not present, authorized / unauthorized |
| HC-SR04 ultrasonic | Distance in cm; values under 30 cm are a restricted zone |
| PIR motion | Unusual movement at the desk |
| Vibration | Desk shake / abnormal movement |

## ESP32 role

The ESP32 is the IoT layer. It receives serial packets from the Arduino and forwards them over Wi-Fi. The panel shows ONLINE status, packet counters, last event, Wi-Fi status, and the last compact JSON packet.

## AI vision events

Computer vision is simulated with toggles (no webcam processing):

- Face missing / restored
- Phone detected / removed
- Second person / only candidate
- Looking away / looking normal

## Integrity scoring

Score starts at 0 and is recomputed from **currently active** flags (not a running total). Maximum is 100.

| Event | Points |
| --- | --- |
| Face missing | +10 |
| Looking away | +10 |
| PIR unusual movement | +10 |
| Ultrasonic restricted-zone object | +15 |
| Vibration detected | +15 |
| Unauthorized RFID | +25 |
| Phone detected | +30 |
| Second person detected | +40 |

Risk bands:

- 0–19 NORMAL
- 20–39 WATCH
- 40–59 SUSPICIOUS
- 60–79 HIGH RISK
- 80–100 CRITICAL

Demo scenarios:

1. **Normal Exam** → score 0
2. **Phone Cheating** → score 30
3. **Suspicious Activity** → score 50
4. **Critical Cheating** → score 100 (raw 120, capped)

## How to run

```bash
npm install
npm run dev
```

Open the local Vite URL (typically `http://localhost:5173`).

## Replacing the simulator with real hardware

All hardware updates flow through a single function:

```js
processHardwarePacket(packet, dispatch)
```

Defined in `src/logic/simulator.js`.

The simulator already calls this function. Later, a WebSocket or MQTT client can call the same function with packets from the ESP32.

Supported shapes:

Arduino-style nested packet:

```json
{
  "device": "arduino_uno",
  "timestamp": "...",
  "rfid": { "detected": true, "authorized": true },
  "ultrasonic": { "distance": 54 },
  "pir": { "motion": false },
  "vibration": { "detected": false }
}
```

ESP32 compact packet:

```json
{
  "rfid": true,
  "distance": 54,
  "pir": false,
  "vibration": false
}
```

Do not wire WebSocket/MQTT until the hardware firmware is ready. Keep `processHardwarePacket` as the only ingest boundary so the UI does not care where packets originate.
