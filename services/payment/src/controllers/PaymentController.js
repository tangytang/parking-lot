const PaymentService = require('../services/PaymentService');

const paymentService = new PaymentService();

(async () => {
  try {
    await paymentService.initializeRabbit();

  } catch (error) {
    console.error('Failed to start parking service:', error);
  }
})();

exports.processPayment = (req, res) => {
  let { amount, vehicleId, paymentMethod } = req.body;

  amount = parseFloat(amount);

  if (isNaN(amount || amount <= 0)) {
    return res.status(400).json({ success: false, message: 'Invalid amount' });
  }

  const result = paymentService.enqueuePayment(vehicleId, amount, paymentMethod);

  return res.status(result.json ? 200 : 400).json(result);
}

