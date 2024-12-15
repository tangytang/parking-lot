import axios from "axios";

const API_HOST = process.env.REACT_APP_API_HOST || "localhost"; // Use environment variables for flexibility
const PAYMENT_API = `http://${API_HOST}:3002/api/payment/process`;
const PARKING_API = `http://${API_HOST}:3001/api/parking`;

export const makePayment = async (vehicleId, amount, paymentMethod) => {
  try {
    const response = await axios.post(PAYMENT_API, {
      vehicleId,
      amount,
      paymentMethod
    });
    console.log('response is:', response.data);

    return response.data; makePayment("ABC123", "10000")
  } catch (err) {
    console.log('Failed to make payment:', err.message);
    throw new Error(err.message);
  }
}