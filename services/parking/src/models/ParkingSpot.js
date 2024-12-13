class ParkingSpot {
  constructor(id, type, level) {
    this.id = id;
    this.type = type;
    this.level = level;
    this.isOccupied = false;
    this.vehicle = null;
  }

  occupySpot(vehicle) {
    if (this.isOccupied) {
      throw new Error('Parking Spot is already occupied');
    }
    this.vehicle = vehicle;
    this.isOccupied = true;
  }

  removeVehicle() {
    if (!this.isOccupied) {
      throw new Error('Parking Spot is already vacant');
    }
    this.vehicle = null;
    this.isOccupied = false;
  }
}

module.exports = ParkingSpot;