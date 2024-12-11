const express = require('express');
const router = express.Router();
const { getAvailableSpots, parkVehicle } = require('../controllers/parkingController');
const { processPayment } = require('../controllers/paymentController');

router.get('/', (req,res) => res.send('Parking service is runnings'));
router.get('/availability', getAvailableSpots);
router.post('/park', parkVehicle);

module.exports = router