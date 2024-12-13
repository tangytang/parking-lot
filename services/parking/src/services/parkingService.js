const Vehicle = require('../models/Vehicle');

class ParkingService {
  constructor(parkingLot) {
    this.parkingLot = parkingLot;
  }

  getAvailability() {
    const availability = {}
    this.parkingLot.floors.forEach((floor) => {
    availability[floor.level] = floor.spots.reduce((acc, spot) => {
      if (!spot.isOccupied) {
        acc[spot.type] = (acc[spot.type] || 0) + 1;
      }
      return acc;
    }, {});
  });

  return availability;
  }

  parkVehicle(vehicleId, type) {
    const vehicle = new Vehicle(vehicleId, type);
    const spot = this.parkingLot.findSpot(type);
    
    if (!spot) {
      return {
        success: false,
        message: `No available spot from for the vehicle type ${type}`
      }
    }

    try {
      spot.occupySpot(vehicle);
      return {
        success: true,
        message: `Vehicle ${vehicleId} parked at spot ${spot.id}`,
        spotId: spot.id,
        level: spot.level
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  unparkVehicle(spotId) {
    for (const floor of this.parkingLot.floors) {
      const spot = floor.spots.find((spot) => spot.id === spotId);
      if (spot) {
        try {
          spot.removeVehicle();
          return {
            success: true,
            message: `Vehicle removed from spot ${spot.id}`
          }
        } catch (err) {
          return { success: false, message: err.message };
        }
      }
    }
    return {
      success: false,
      message: `Spot ${spotId} not found or already empty`
    }
  }

}

module.exports = ParkingService;