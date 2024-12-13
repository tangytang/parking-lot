const ParkingLot = require('../models/ParkingLot');
const ParkingFloor = require('../models/ParkingFloor');

const parkingLot = new ParkingLot('Main Lot');

const floorConfig = [
  { level: 1, spots: [{ type: 'compact', count: 10 }, { type: 'large', count: 10 }] },
  { level: 2, spots: [{ type: 'compact', count: 10 }, { type: 'large', count: 10 }] },
  { level: 3, spots: [{ type: 'compact', count: 20 }, { type: 'large', count: 30 }] },
]

// Initialize floors based on config
floorConfig.forEach(({ level, spots }) => {
  const floor = new ParkingFloor(level, spots);
  parkingLot.addFloor(floor);
});

module.exports = parkingLot;