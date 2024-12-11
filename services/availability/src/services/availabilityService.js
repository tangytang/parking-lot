const spotAvailability = {
  compact: 50,
  large: 20,
  handicapped: 5,
  ev: 10,
  motorcycle: 10,
};


exports.updateAvailability = (spotType, delta) => {
  if (spotAvailability[spotType] + delta < 0) {
    return {
      success: false,
      message: 'Not enough spots available',
    };
  }
  spotAvailability[spotType] += delta;
  return {
    success: true,
    message: `${spotType} spot updated, ${spotAvailability[`${spotType}`]} available`,
  };
}

exports.getAvailability = () => {
  return {
    success: true,
    data: spotAvailability,
  };
}