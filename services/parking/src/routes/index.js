const express = require('express');

module.exports = (parkingService) => {
  const router = express.Router();

  router.get('/', (req, res) => res.send('Parking service is running'));

  router.get('/availability', async (req, res) => {
    try {
      const result = parkingService.getAvailability();
      res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching availability:', error.message);
      res.status(500).json({ success: false, message: 'Failed to fetch availability.' });
    }
  });

  router.post('/park', async (req, res) => {
    const { vehicleId, vehicleType } = req.body;

    if (!vehicleId || !vehicleType) {
      return res.status(400).json({ success: false, message: 'Vehicle ID and type are required.' });
    }

    try {
      const result = await parkingService.parkVehicle(vehicleId, vehicleType);
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Error parking vehicle:', error.message);
      res.status(500).json({ success: false, message: 'Failed to park the vehicle.' });
    }
  });

  router.post('/unpark', async (req, res) => {
    const { vehicleType } = req.body;

    if (!vehicleType) {
      return res.status(400).json({ success: false, message: 'Vehicle type is required.' });
    }

    try {
      const result = await parkingService.unparkVehicle(vehicleType);
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Error unparking vehicle:', error.message);
      res.status(500).json({ success: false, message: 'Failed to unpark the vehicle.' });
    }
  });

  return router;
};
