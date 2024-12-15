const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const PaymentService = require('./services/PaymentService');
const paymentRouter = require('./router'); // Payment router

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins (or restrict as needed)
  },
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize PaymentService with WebSocket
const amqpUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
const paymentService = new PaymentService(amqpUrl, io);

(async () => {
  try {
    await paymentService.initializeRabbit();
    console.log('Payment service connected to RabbitMQ.');
  } catch (error) {
    console.error('Failed to initialize PaymentService:', error);
  }
})();

// Pass paymentService to the router
app.use('/api/payment', paymentRouter(paymentService));

// WebSocket connection handler
io.on('connection', (socket) => {
  console.log('Dashboard connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Dashboard disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`Payment service is running on port ${PORT}!`);
});
