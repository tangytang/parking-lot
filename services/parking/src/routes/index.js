const express = require('express');
const router = express.Router();
const { getAvailableSpots, parkVehicle, removeVehicle } = require('../controllers/parkingController');

router.get('/', (req,res) => res.send('Parking service is runningsss'));
router.get('/availability', getAvailableSpots);
router.post('/park', parkVehicle);

module.exports = router