const Payment = require('../models/Payment');

class PaymentService {
  constructor() {
    this.payments = [];
  }

  processPayment(vehicleId, amount, paymentMethod) {
    const payment = new Payment(amount, vehicleId, paymentMethod);
    
    //Simulate payment
    payment.completePayment();

    this.payments.push(payment);

    return {
      success: true,
      paymentId: payment.paymentId,
      message: 'Payment processed successfully!',
    }
  }
}

module.exports = PaymentService;