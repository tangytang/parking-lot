const ParkingSpot = require("./ParkingSpot");

class ParkingFloor {
constructor(level, spotConfig = []) {
  this.level = level;
  this.spots = [];

  // Initialize Spots
  spotConfig.forEach(({type, count}) => {
    for (let i= 1; i <= count; i++) {
      const spotId = `${type.charAt(0).toUpperCase()}${level}-${i}`;
      this.spots.push(new ParkingSpot(spotId, type, level)); 
    }
  });
}

addSpot(spot) {
  this.spots.push(spot);
}

findAvailableSpot(vehicleType) {
  return this.spots.find((spot) => spot.type === vehicleType && !spot.isOccupied);
}
}

module.exports = ParkingFloor;