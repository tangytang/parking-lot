const parkingService = require('../services/parkingService');

exports.getAvailableSpots = async (req,res) => {
  const availability = parkingService.getAvailableSpots();
  res.json(availability);
}

exports.parkVehicle = async (req,res) => {
  const { vehicleType } = req.body;
  const result = parkingService.parkVehicle(vehicleType);
  res.status(result.success?  200 : 400).json(result);
}