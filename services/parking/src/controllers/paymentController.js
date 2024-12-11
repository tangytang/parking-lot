const PaymentService = require('../../../payment/src/services/PaymentService');

const paymentService = new PaymentService();

exports.processPayment = (req, res) => {
  let { amount, vehicleId, paymentMethod } = req.body;

  amount = parseFloat(amount);
  
  if (isNaN(amount || amount <= 0)) {
    return res.status(400).json({ success:false, message: 'Invalid amount' });
  }

  const result = paymentService.processPayment();

  return res.status(result.json ? 200 : 400).json(result);
}

