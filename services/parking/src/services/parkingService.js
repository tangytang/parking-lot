const amqp = require('amqplib');
const Vehicle = require('../models/Vehicle');

class ParkingService {
  constructor(parkingLot, amqpUrl, io) {
    this.parkingLot = parkingLot;
    this.amqpUrl = amqpUrl;
    this.channel = null;
    this.io = io;
    this.queue = 'parkingtransactions';
    this.activeWorkers = new Set();
    this.maxWorkers = 4;
  }

  // Initialize RabbitMQ connection and channel
  async initializeRabbitMQ() {
    try {
      const connection = await amqp.connect(this.amqpUrl);
      this.channel = await connection.createChannel();
      await this.channel.assertQueue(this.queue, { durable: true });
      console.log(`RabbitMQ connected. Queue "${this.queue}" is ready.`);

      setInterval(async () => {
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
      }, 5000);
    } catch (error) {
      console.error('Failed to initialize RabbitMQ:', error);
      throw error;
    }
  }

  scaleUpWorkers(count, connection) {
    for (let i = 0; i < count; i++) {
      const workerId = `worker-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      console.log(`Spawning new worker: ${workerId}`);
      this.activeWorkers.add(workerId);
      this.createWorker(connection, workerId);
    }
  }

  scaleDownWorkers(count) {
    const workersToRemove = Array.from(this.activeWorkers).slice(0, count);
    workersToRemove.forEach((workerId) => {
      console.log(`Stopping worker: ${workerId}`);
      this.activeWorkers.delete(workerId);
    });
  }

  async createWorker(connection, workerId) {
    try {
      const workerChannel = await connection.createChannel();
      await workerChannel.assertQueue(this.queue, { durable: true });
      workerChannel.prefetch(1);

      console.log(`${workerId} is ready to consume messages.`);

      workerChannel.consume(this.queue, async (msg) => {
        if (msg !== null) {
          const transaction = JSON.parse(msg.content.toString());
          console.log(`${workerId} processing transaction: ${transaction.vehicleId}, Type: ${transaction.type}`);

          try {
            await new Promise((resolve) => setTimeout(resolve, 5000));
            const spot = this.parkingLot.findSpot(transaction.type);

            if (!spot) throw new Error(`No available spot for type ${transaction.type}`);

            spot.occupySpot(new Vehicle(transaction.vehicleId, transaction.type));
            console.log(`${workerId} parked vehicle ${transaction.vehicleId} at spot ${spot.id}`);

            this.io.emit('parkingUpdate', { transaction, spot });
            workerChannel.ack(msg);
          } catch (error) {
            console.error(`${workerId} failed to process transaction: ${error.message}`);
            workerChannel.nack(msg, false, true);
          }
        }
      });
    } catch (error) {
      console.error(`Error in worker ${workerId}:`, error.message);
    }
  }

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

  // Get parking availability
  getAvailability() {
    const availability = {};
    this.parkingLot.floors.forEach((floor) => {
      availability[floor.level] = floor.spots.reduce((acc, spot) => {
        if (!spot.isOccupied) {
          acc[spot.type] = (acc[spot.type] || 0) + 1;
        }
        return acc;
      }, {});
    });

    return {
      success: true,
      message: 'Parking availability fetched successfully.',
      data: availability,
    };
  }
}

module.exports = ParkingService;
