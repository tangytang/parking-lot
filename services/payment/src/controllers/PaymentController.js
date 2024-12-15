exports.createProcessPaymentHandler = (paymentService) => {
  return async (req, res) => {
    const { amount, vehicleId, paymentMethod } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    try {
      const result = await paymentService.enqueuePayment(vehicleId, parseFloat(amount), paymentMethod);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Failed to process payment:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
};
