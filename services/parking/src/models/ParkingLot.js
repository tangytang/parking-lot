class ParkingLot {
  constructor(name) {
    this.name = name;
    this.floors = [];
  }

  addFloor(floor) {
    this.floors.push(floor);
  }

  findSpot(type) {
    for (const floor of this.floors) {
      const spot = floor.findAvailableSpot(type);
      if (spot) {
        return spot;
      }
    }
    return {
      success: false,
      message: 'Parking Lot is Full'
    }
  }
}

module.exports = ParkingLot;