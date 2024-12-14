const amqp = require('amqplib/callback_api');
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use('/api/parking', routes);

app.listen(3001, async () => {
  
  console.log('Parking service is running on port 3001');

//   // Initialize RabbitMQ Channel
//   amqp.connect('amqp://localhost', function(error0, connection) {
//   if (error0) {
//     throw error0;
//   }
//   connection.createChannel(function(error1, channel) {
//     if (error1) {
//       throw error1;
//     }

//     // Define queues
//     const queues = ['parkingtransactions', 'paymentsqueue'];

//     // Define a message for each queue
//     const messages = {
//       parkingtransactions: 'Parking transaction message',
//       paymentsqueue: 'Payment processing messages',
//     };

//     // Create and send messages to each queue
//     queues.forEach((queue) => {
//       channel.assertQueue(queue, { durable: true });
//       channel.sendToQueue(queue, Buffer.from(messages[queue]));
//       console.log(` [x] Sent message to ${queue}: ${messages[queue]}`);
//     });
//   });
// });
});
