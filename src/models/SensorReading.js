const mongoose = require('mongoose');

const sensorReadingSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: [true, 'deviceId is required'],
    trim: true,
  },
  temperature: {
    type: Number,
    required: [true, 'temperature is required'],
  },
  timestamp: {
    type: Number,
    default: () => Date.now(),
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
});

sensorReadingSchema.index({ deviceId: 1, timestamp: -1 });

module.exports = mongoose.model('SensorReading', sensorReadingSchema);
