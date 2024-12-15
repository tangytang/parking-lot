const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const ParkingService = require('./services/parkingService');
const parkingRouter = require('./routes'); // Parking router

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins (configure as needed)
  },
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize ParkingService with WebSocket
const amqpUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
const parkingLot = require('./database/parkingLotData'); // Load the parking lot data
const parkingService = new ParkingService(parkingLot, amqpUrl, io);

(async () => {
  try {
    await parkingService.initializeRabbitMQ();
    console.log('Parking service connected to RabbitMQ.');
  } catch (error) {
    console.error('Failed to initialize ParkingService:', error);
  }
})();

// Pass parkingService to the router
app.use('/api/parking', parkingRouter(parkingService));

// WebSocket connection handler
io.on('connection', (socket) => {
  console.log('Dashboard connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Dashboard disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Parking service is running on port ${PORT}!`);
});
