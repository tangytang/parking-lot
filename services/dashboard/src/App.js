import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import "./App.css";

function App() {
  const [parkingData, setParkingData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [vehicleId, setVehicleId] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const [modalVisible, setModalVisible] = useState(false); // Modal state
  const [modalContent, setModalContent] = useState(null); // Modal content

  useEffect(() => {
    const socket = io("http://localhost:3002");

    socket.on("parkingUpdate", (data) => {
      setParkingData((prev) => [...prev, data]);
    });

    socket.on("paymentUpdate", (data) => {
      setPaymentData((prev) => [...prev, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleParkingSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3002/api/parking/park", {
        vehicleId,
        vehicleType,
      });
      setModalContent({
        title: "Parking Request",
        message: `Vehicle ${vehicleId} has been parked successfully!`,
      });
      setModalVisible(true);
      setVehicleId("");
      setVehicleType("");
    } catch (error) {
      setModalContent({
        title: "Parking Request Failed",
        message: "Failed to process parking request. Please try again.",
      });
      setModalVisible(true);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3002/api/payment/process", {
        vehicleId,
        amount: parseFloat(paymentAmount),
        paymentMethod,
      });
      setModalContent({
        title: "Payment Request",
        message: `Payment of $${paymentAmount} for vehicle ${vehicleId} has been processed successfully!`,
      });
      setModalVisible(true);
      setPaymentAmount("");
      setPaymentMethod("");
    } catch (error) {
      setModalContent({
        title: "Payment Request Failed",
        message: "Failed to process payment request. Please try again.",
      });
      setModalVisible(true);
    }
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h1>Real-Time Parking Dashboard</h1>
      </nav>
      <main className="content">
        <section className="section">
          <h2>Parking Service</h2>
          <form onSubmit={handleParkingSubmit}>
            <input
              type="text"
              placeholder="Vehicle ID"
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
            />
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
            >
              <option value="">Select Vehicle Type</option>
              <option value="compact">Compact</option>
              <option value="large">Large</option>
              <option value="motorcycle">Motorcycle</option>
              <option value="handicapped">Handicapped</option>
              <option value="ev">EV</option>
            </select>
            <button type="submit">Submit Parking</button>
          </form>
        </section>
        <section className="section">
          <h2>Payment Service</h2>
          <form onSubmit={handlePaymentSubmit}>
            <input
              type="text"
              placeholder="Vehicle ID"
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
            />
            <input
              type="number"
              placeholder="Amount"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
            />
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="">Select Payment Method</option>
              <option value="credit_card">Credit Card</option>
              <option value="cash">Cash</option>
              <option value="mobile_payment">Mobile Payment</option>
            </select>
            <button type="submit">Submit Payment</button>
          </form>
        </section>
      </main>
      <footer className="footer">
        <p>© 2024 Real-Time Parking Dashboard by Ivan</p>
      </footer>

      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h2>{modalContent.title}</h2>
            <p>{modalContent.message}</p>
            <button onClick={() => setModalVisible(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
