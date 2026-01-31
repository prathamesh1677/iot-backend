const express = require('express');
const router = express.Router();
const SensorReading = require('../models/SensorReading');

router.post('/ingest', async (req, res) => {
  try {
    const { deviceId, temperature, timestamp } = req.body;

    if (!deviceId || deviceId === '') {
      return res.status(400).json({
        success: false,
        error: 'deviceId is required',
      });
    }

    if (temperature === undefined || temperature === null) {
      return res.status(400).json({
        success: false,
        error: 'temperature is required',
      });
    }

    if (typeof temperature !== 'number' || isNaN(temperature)) {
      return res.status(400).json({
        success: false,
        error: 'temperature must be a valid number',
      });
    }

    const reading = new SensorReading({
      deviceId: String(deviceId).trim(),
      temperature,
      timestamp: timestamp !== undefined && timestamp !== null ? Number(timestamp) : Date.now(),
    });

    await reading.save();

    res.status(201).json({
      success: true,
      data: {
        id: reading._id,
        deviceId: reading.deviceId,
        temperature: reading.temperature,
        timestamp: reading.timestamp,
        createdAt: reading.createdAt,
      },
    });
  } catch (error) {
    console.error('Ingest error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save sensor reading',
    });
  }
});

router.get('/:deviceId/latest', async (req, res) => {
  try {
    const { deviceId } = req.params;

    const latest = await SensorReading.findOne({ deviceId })
      .sort({ timestamp: -1 })
      .lean();

    if (!latest) {
      return res.status(404).json({
        success: false,
        error: `No readings found for device: ${deviceId}`,
      });
    }

    res.json({
      success: true,
      data: {
        deviceId: latest.deviceId,
        temperature: latest.temperature,
        timestamp: latest.timestamp,
        createdAt: latest.createdAt,
      },
    });
  } catch (error) {
    console.error('Latest reading error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve latest reading',
    });
  }
});

module.exports = router;
