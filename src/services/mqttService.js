const mqtt = require('mqtt');
const SensorReading = require('../models/SensorReading');


const startMqttSubscriber = () => {
  const brokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://broker.emqx.io';
  const client = mqtt.connect(brokerUrl);

  client.on('connect', () => {
    console.log('MQTT Connected to broker');
    client.subscribe('iot/sensor/+/temperature', (err) => {
      if (err) {
        console.error('MQTT subscribe error:', err);
      } else {
        console.log('MQTT Subscribed to: iot/sensor/+/temperature');
      }
    });
  });

  client.on('message', async (topic, message) => {
    try {
      const parts = topic.split('/');
      const deviceId = parts[2];

      if (!deviceId) {
        console.warn('Invalid topic format, deviceId not found:', topic);
        return;
      }

      const payload = message.toString();
      let temperature;

      try {
        const parsed = JSON.parse(payload);
        temperature = typeof parsed.temperature === 'number' ? parsed.temperature : parseFloat(parsed.temperature);
      } catch {
        temperature = parseFloat(payload);
      }

      if (isNaN(temperature)) {
        console.warn('Invalid temperature in message:', payload);
        return;
      }

      const reading = new SensorReading({
        deviceId,
        temperature,
        timestamp: Date.now(),
      });

      await reading.save();
      console.log(`MQTT: Saved reading for ${deviceId}, temp: ${temperature}`);
    } catch (error) {
      console.error('MQTT message processing error:', error);
    }
  });

  client.on('error', (err) => {
    console.error('MQTT error:', err);
  });

  client.on('close', () => {
    console.log('MQTT connection closed');
  });

  return client;
};

module.exports = { startMqttSubscriber };
