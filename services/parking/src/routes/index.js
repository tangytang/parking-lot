const express = require('express');
const router = express.Router();
const { getAvailableSpots, parkVehicle, removeVehicle } = require('../controllers/parking');

routes.get('/availability', getAvailableSpots);
routes.post('/park', parkVehicle);

module.exports = router