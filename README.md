# IoT Sensor Temperature API

Node.js backend for IoT sensor temperature readings. Stores data in MongoDB and exposes REST APIs. MQTT subscriber included as bonus.

**Requirements:** Node.js 18+, MongoDB Atlas (or use in-memory mode)

## Setup

```bash
git clone <repo-url>
cd iot-sensor-api
npm install
```

Create `.env`:

```
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/iot-sensors?retryWrites=true&w=majority
PORT=3000
```

If Atlas doesn't connect (e.g. ECONNREFUSED), run with in-memory DB instead:

```bash
npm run dev:memory
```

Otherwise:

```bash
npm start
```

Server runs on http://localhost:3000

## API

### POST /api/sensor/ingest

Body: `deviceId` (required), `temperature` (required), `timestamp` (optional, defaults to now)

**curl (Bash):**
```bash
curl -X POST http://localhost:3000/api/sensor/ingest -H "Content-Type: application/json" -d '{"deviceId":"sensor-01","temperature":32.1,"timestamp":1705312440000}'
```

**curl (PowerShell):**
```powershell
curl.exe -X POST http://localhost:3000/api/sensor/ingest -H "Content-Type: application/json" -d '{"deviceId":"sensor-01","temperature":32.1,"timestamp":1705312440000}'
```

### GET /api/sensor/:deviceId/latest

**curl (Bash):**
```bash
curl http://localhost:3000/api/sensor/sensor-01/latest
```

**curl (PowerShell):**
```powershell
curl.exe http://localhost:3000/api/sensor/sensor-01/latest
```

## Postman

**POST** `http://localhost:3000/api/sensor/ingest`
- Header: `Content-Type: application/json`
- Body (raw JSON): `{"deviceId":"sensor-01","temperature":32.1,"timestamp":1705312440000}`

**GET** `http://localhost:3000/api/sensor/sensor-01/latest`

## MQTT 

Set in `.env`:
```
MQTT_ENABLED=true
MQTT_BROKER_URL=mqtt://broker.emqx.io
```

Topic: `iot/sensor/<deviceId>/temperature`

Publish a number or `{"temperature": 32.5}` to ingest via MQTT.
