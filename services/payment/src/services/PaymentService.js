class PaymentService {
  constructor(amqpUrl, io) {
    this.amqpUrl = amqpUrl; // RabbitMQ URL
    this.channel = null; // RabbitMQ channel
    this.queue = 'payment_channel'; // RabbitMQ queue name
    this.io = io; // WebSocket instance
    this.activeWorkers = new Set(); // Track active workers
    this.maxWorkers = 4; // Maximum number of workers
  }

  // Initialize RabbitMQ connection and set up scaling
  async initializeRabbit() {
    try {
      const connection = await require('amqplib').connect(this.amqpUrl);
      this.channel = await connection.createChannel();
      await this.channel.assertQueue(this.queue, { durable: true });
      console.log(`RabbitMQ channel created for queue: ${this.queue}`);

      // Start worker scaling logic
      setInterval(() => this.scaleWorkers(connection), 5000);
    } catch (error) {
      console.error('Failed to initialize RabbitMQ:', error);
    }
  }

  // Scale workers based on the queue length
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

  // Create a new worker to process messages
  async createWorker(connection, workerId) {
    try {
      const workerChannel = await connection.createChannel();
      await workerChannel.assertQueue(this.queue, { durable: true });
      workerChannel.prefetch(1); // Fair distribution of messages

      console.log(`${workerId} is waiting for messages in queue "${this.queue}"`);

      workerChannel.consume(this.queue, async (msg) => {
        if (msg) {
          const transaction = JSON.parse(msg.content.toString());
          console.log(`Worker ${workerId} processing payment for vehicle ${transaction.vehicleId}...`);

          try {
            await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate delay

            const result = this.processPayment(
              transaction.vehicleId,
              transaction.amount,
              transaction.paymentMethod
            );

            // Broadcast the result to WebSocket clients
            if (this.io) {
              this.io.emit('paymentUpdate', { transaction, result });

            }

            workerChannel.ack(msg); // Acknowledge the message
          } catch (error) {
            console.error(`Worker ${workerId} failed to process payment:`, error.message);
            workerChannel.nack(msg, false, true); // Requeue the message
          }
        }
      });
    } catch (error) {
      console.error(`Failed to create worker ${workerId}:`, error);
    }
  }

  // Enqueue a payment transaction
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

  // Simulate processing a payment
  processPayment(vehicleId, amount, paymentMethod) {
    return {
      success: true,
      message: `Payment of ${amount} for vehicle ${vehicleId} processed using ${paymentMethod}`,
    };
  }
}

module.exports = PaymentService;
