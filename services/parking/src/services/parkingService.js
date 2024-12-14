const amqp = require('amqplib');
const Vehicle = require('../models/Vehicle');

class ParkingService {
  constructor(parkingLot, amqpUrl) {
    this.parkingLot = parkingLot;
    this.amqpUrl = amqpUrl;
    this.channel = null;
    this.queue = 'parkingtransactions';
    this.activeWorkers = new Set(); // Track active workers
    this.maxWorkers = 4; // Set an upper limit for scaling
  }

  // Initialize RabbitMQ connection and channel
  async initializeRabbitMQ() {
    try {
      const connection = await amqp.connect(this.amqpUrl);
      this.channel = await connection.createChannel();
      await this.channel.assertQueue(this.queue, { durable: true });
      console.log(`RabbitMQ connected. Queue "${this.queue}" is ready.`);

      // Periodically check the queue length and scale workers
      setInterval(async () => {
        const queueState = await this.channel.checkQueue(this.queue);
        const queueLength = queueState.messageCount;

        console.log(`Queue length: ${queueLength}`);

        const desiredWorkers = Math.min(queueLength, this.maxWorkers);
        const currentWorkers = this.activeWorkers.size;

        console.log(`Current workers: ${currentWorkers}, Desired workers: ${desiredWorkers}`);

        // Scale up or down workers
        if (desiredWorkers > currentWorkers) {
          this.scaleUpWorkers(desiredWorkers - currentWorkers, connection);
        } else if (desiredWorkers < currentWorkers) {
          this.scaleDownWorkers(currentWorkers - desiredWorkers);
        }
      }, 5000); // Check every 5 seconds
    } catch (error) {
      console.error('Failed to initialize RabbitMQ:', error);
      throw error;
    }
  }

  // Scale up by spawning new workers
  scaleUpWorkers(count, connection) {
    for (let i = 0; i < this.maxWorkers; i++) {
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
      console.log(`Stopping worker: ${workerId}`);
      this.activeWorkers.delete(workerId);
      // No explicit stop logic needed as the worker loop will naturally finish
    });
  }

  // Create a new worker
  async createWorker(connection, workerId) {
    try {
      const workerChannel = await connection.createChannel();
      await workerChannel.assertQueue(this.queue, { durable: true });

      // Set prefetch limit to 1 to distribute messages fairly
      workerChannel.prefetch(1);

      console.log(`${workerId} is ready to consume messages.`);

      workerChannel.consume(this.queue, async (msg) => {
        if (msg !== null) {
          const transaction = JSON.parse(msg.content.toString());
          console.log(`${workerId} processing transaction: ${transaction.vehicleId}, Type: ${transaction.type}`);

          try {
            // Simulate processing delay
            await new Promise((resolve) => setTimeout(resolve, 5000));

            // Find and occupy parking spot
            const spot = this.parkingLot.findSpot(transaction.type);
            if (!spot.success) throw new Error(`Failed to park ${transaction.vehicleId}. No available spot for vehicle type ${transaction.type}`);

            spot.occupySpot(new Vehicle(transaction.vehicleId, transaction.type));
            console.log(`${workerId} parked vehicle ${transaction.vehicleId} at spot ${spot.id}`);

            // Acknowledge message upon success
            workerChannel.ack(msg);
          } catch (error) {
            console.error(`${workerId} failed to process transaction: ${error.message}`);
            // Requeue message for retry
            workerChannel.nack(msg, false, true);
          }
        }
      });
    } catch (error) {
      console.error(`Error in worker ${workerId}:`, error.message);
    }
  }


  // Producer: Enqueue the parking transaction
  async parkVehicle(vehicleId, type) {
    const transaction = {
      vehicleId,
      type,
      status: 'queued',
      timestamp: new Date().toISOString(),
    };

    try {
      if (this.channel) {
        await this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(transaction)), {
          persistent: true,
        });
        console.log('Transaction queued in RabbitMQ:', transaction);
      } else {
        throw new Error('RabbitMQ channel not initialized');
      }

      return {
        success: true,
        message: `Transaction for vehicle ${vehicleId} queued successfully`,
        transaction,
      };
    } catch (error) {
      console.error('Failed to enqueue transaction:', error);
      return { success: false, message: 'Failed to queue transaction', error: error.message };
    }
  }
}

module.exports = ParkingService;
