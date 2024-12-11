const paymentService = require('../services/paymentService');

exports.processPayment = async (req, res) => {
  const { amount, vehicleId } =- req.body

  const result = paymentService.processPayment(amount, vehicleId);

  res.status(result.success ? 200 : 400).json(result);
}