exports.processPayment = (vehicleId, amount) => {
  if (amount <= 0) {
    return { success: false, message: 'Invalid payment amount' };
  }

  console.log(`Processing payment of ${amount} for vehicle ${vehicleId}`);
  
  return {
    success: true,
    message: 'Payment processed successfully',
  }
}