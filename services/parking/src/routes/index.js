const express = require('express');
const router = express.Router();
const { getAvailability, parkVehicle, unparkVehicle } = require('../controllers/parkingController');

router.get('/', (req,res) => res.send('Parking service is runnings'));
router.get('/availability', getAvailability);
router.post('/park', parkVehicle);
router.post('/unpark',unparkVehicle);

module.exports = router