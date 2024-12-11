class Payment {
  constructor(amount, vehicleId, paymentMethod) {
    this.paymentId = `${vehicleId}_${Date.now()}`;
    this.amount = amount;
    this.vehicleId = vehicleId;
    this.paymentMethod = paymentMethod;
    this.status = 'pending';
    this.timestamp = new Date();
  }

  completePayment() {
    this.status = 'completed';
  }
}

module.exports = Payment;