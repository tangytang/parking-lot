const express = require('express');
const router = express.Router();
const { processPayment } = require('../controllers/PaymentController');

router.get('/', (req, res) => res.send('Payment service is running!@@'));
router.post('/process', processPayment);


module.exports = router;