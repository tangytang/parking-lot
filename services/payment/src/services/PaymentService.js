const amqp = require('amqplib');
const Payment = require('../models/Payment');

class PaymentService {
  constructor(amqpUrl) {
    this.payments = [];
    this.amqpUrl = amqpUrl;
    this.channel = null;
    this.queue = 'payment_channel';
    this.activeWorkers = new Set();
    this.maxWorkers = 4;
  }

  // Initialize RabbitMQ connection and channel
  async initializeRabbit() {
    try {
      const connection = await amqp.connect(this.amqpUrl);
      this.channel = await connection.createChannel();
      await this.channel.assertQueue(this.queue, { durable: true });
      console.log(`RabbitMQ channel created for queue: ${this.queue}`);

      // Periodically check the queue length and scale workers
      setInterval(async () => {
        await this.scaleWorkers(connection);
      }, 5000);
    } catch (error) {
      console.error('Failed to initialize RabbitMQ:', error);
      throw error;
    }
  }

  // Scale workers based on queue length
  async scaleWorkers(connection) {
    try {
      const queueState = await this.channel.checkQueue(this.queue);
      const queueLength = queueState.messageCount;

      console.log(`Queue length: ${queueLength}`);

      const desiredWorkers = Math.min(queueLength, this.maxWorkers);
      const currentWorkers = this.activeWorkers.size;

      console.log(`Current workers: ${currentWorkers}, Desired workers: ${desiredWorkers}`);

      if (desiredWorkers > currentWorkers) {
        this.scaleUpWorkers(desiredWorkers - currentWorkers, connection);
      } else if (desiredWorkers < currentWorkers) {
        this.scaleDownWorkers(currentWorkers - desiredWorkers);
      }
    } catch (error) {
      console.error('Error scaling workers:', error);
    }
  }

  // Scale up by spawning new workers
  scaleUpWorkers(count, connection) {
    for (let i = 0; i < count; i++) {
      const workerId = `worker-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      console.log(`Spawning new worker: ${workerId}`);
      this.activeWorkers.add(workerId);
      this.createWorker(connection, workerId);
    }
  }

  // Scale down by removing workers
  scaleDownWorkers(count) {
    const workersToRemove = Array.from(this.activeWorkers).slice(0, count);
    workersToRemove.forEach((workerId) => {
      console.log(`Removing worker: ${workerId}`);
      this.activeWorkers.delete(workerId);
    });
  }

  // Create a new worker
  async createWorker(connection, workerId) {
    try {
      const workerChannel = await connection.createChannel();
      await workerChannel.assertQueue(this.queue, { durable: true });

      // Set prefetch to 1 to distribute messages fairly
      workerChannel.prefetch(1);

      console.log(`${workerId} is waiting for messages in queue "${this.queue}"`);

      workerChannel.consume(this.queue, async (msg) => {
        if (msg) {
          const transaction = JSON.parse(msg.content.toString());
          console.log(`Worker ${workerId} processing payment for vehicle ${transaction.vehicleId}...`);

          try {
            // Simulate processing delay
            await new Promise((resolve) => setTimeout(resolve, 5000));

            const result = this.processPayment(transaction.vehicleId, transaction.amount, transaction.paymentMethod);

            console.log(`Worker ${workerId} processed payment: ${result.message}`);

            // Acknowledge the message upon success
            workerChannel.ack(msg);
          } catch (error) {
            console.error(`Worker ${workerId} failed to process payment:`, error.message);
            workerChannel.nack(msg, false, true); // Optionally requeue the message
          }
        }
      });
    } catch (error) {
      console.error(`Failed to create worker ${workerId}:`, error);
      throw error;
    }
  }

  // Producer: Enqueue payment transaction
  async enqueuePayment(vehicleId, amount, paymentMethod) {
    const transaction = { vehicleId, amount, paymentMethod };

    try {
      if (this.channel) {
        await this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(transaction)));
        console.log('Payment transaction queued:', transaction);
        return { success: true, message: 'Payment transaction queued successfully!' };
      } else {
        throw new Error('RabbitMQ channel not initialized');
      }
    } catch (error) {
      console.error('Failed to enqueue payment transaction:', error);
      return { success: false, message: 'Failed to queue payment transaction', error: error.message };
    }
  }

  // Simulate processing payment
  processPayment(vehicleId, amount, paymentMethod) {
    const payment = new Payment(amount, vehicleId, paymentMethod);
    payment.completePayment();
    this.payments.push(payment);

    return {
      success: true,
      paymentId: payment.paymentId,
      message: 'Payment processed successfully!',
    };
  }
}

module.exports = PaymentService;
