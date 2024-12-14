const ParkingLot = require('../models/ParkingLot');
const ParkingFloor = require('../models/ParkingFloor');

const parkingLot = new ParkingLot('Main Lot');

const floorConfig = [
  {
    level: 1,
    spots: [
      { type: 'compact', count: 10 },      // Supports small cars
      { type: 'large', count: 10000 },         // Supports trucks, vans, and large vehicles on first floor to minimise turns
      { type: 'handicapped', count: 2 },   // Reserved for vehicles with handicapped tags
      { type: 'ev', count: 3 },            // EV charging stations
      { type: 'motorcycle', count: 7 },    // Specifically for motorcycles
    ],
  },
  {
    level: 2,
    spots: [
      { type: 'compact', count: 15 },      // More compact spaces
      { type: 'handicapped', count: 1 },
      { type: 'ev', count: 5 },            // Larger EV allocation on this floor
      { type: 'motorcycle', count: 10 },   // Motorcycle spots only
    ],
  },
  {
    level: 3,
    spots: [
      { type: 'compact', count: 20 },      // Compact spaces only
      { type: 'handicapped', count: 2 },
      { type: 'ev', count: 6 },
      { type: 'motorcycle', count: 5 },
    ],
  },
];


// Initialize floors based on config
floorConfig.forEach(({ level, spots }) => {
  const floor = new ParkingFloor(level, spots);
  parkingLot.addFloor(floor);
});

module.exports = parkingLot;