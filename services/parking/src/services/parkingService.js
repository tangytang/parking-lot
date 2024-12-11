const parkingSpots = {
  compact: 50,
  large: 20,
  handicapped: 5,
  ev: 10,
  motorcycle: 10,
};


exports.getAvailableSpots = () => parkingSpots;

exports.parkVehicle = (vehicleType) => {
  if (parkingSpots[vehicleType] > 0) {
    parkingSpots[vehicleType] -= 1;
    return { success: true, message: `${vehicleType} parked successfully, slot remainingg: ${parkingSpots[vehicleType]}` };
  }
  return { success: false, message: `No parking spots available for ${vehicleType}` };
}