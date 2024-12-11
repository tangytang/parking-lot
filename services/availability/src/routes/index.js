const express = require('express');
const router = express.Router();
const { updateAvailability, getAvailability } = require('../controllers/availabilityController');

router.get('/', getAvailability);
router.post('/update', updateAvailability);


module.exports = router;