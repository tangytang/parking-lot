import React, { useEffect, useState } from "react";
import axios from "axios";
import { makePayment } from "./utilities";
import "./App.css";

function App() {
  const [parkingData, setParkingData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  makePayment("ABC3821*", "10000", "credit card");

  // Fetch parking and payment data
  useEffect(() => {
    async function fetchData() {
      try {

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h1>Dashboard</h1>
      </nav>
      <main className="content">
        <h2>Parking Service</h2>
        <ul>
          {parkingData.map((vehicle, index) => (
            <li key={index}>
              {vehicle.vehicleId} ({vehicle.vehicleType})
            </li>
          ))}
        </ul>

        <h2>Payment Service</h2>
        <ul>
          {paymentData.map((payment, index) => (
            <li key={index}>
              Vehicle ID: {payment.vehicleId} - Amount: ${payment.amount}
            </li>
          ))}
        </ul>
      </main>
      <footer className="footer">
        <p>© 2024 My Dashboard</p>
      </footer>
    </div>
  );
}

export default App;
