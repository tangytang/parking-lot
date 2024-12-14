const ParkingService = require('../services/parkingService');
const parkingLot = require('../database/parkingLotData')

const parkingService = new ParkingService(parkingLot);

(async () => {
  try {
    await parkingService.initializeRabbitMQ();

  } catch (error) {
    console.error('Failed to start parking service:', error);
  }
})();

exports.getAvailability = async (req, res) => {
  const result = parkingService.getAvailability();
  res.status(result.success ? 200 : 400).json(result);
}

// Enqeue the parking request
exports.parkVehicle = async (req, res) => {
  const { vehicleId, vehicleType } = req.body;
  const result = parkingService.parkVehicle(vehicleId, vehicleType);
  res.status(result.success ? 200 : 400).json(result);
}

exports.unparkVehicle = async (req, res) => {
  const { vehicleType } = req.body;
  const result = parkingService.unparkVehicle(vehicleType);
  res.status(result.success ? 200 : 400).json(result);
}
