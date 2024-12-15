const express = require('express');
const { createProcessPaymentHandler } = require('../controllers/PaymentController');

module.exports = (paymentService) => {
  const router = express.Router();

  // Define the processPayment route
  router.post('/process', createProcessPaymentHandler(paymentService));

  // Health check
  router.get('/', (req, res) => res.send('Payment Service is running!'));

  return router;
};
