const availabilityService = require('../services/availabilityService');

exports.updateAvailability = (req, res) => {
  const { spotType, delta } = req.body;
  const result = availabilityService.updateAvailability(spotType, delta);

  res.status( result.succes? 200 : 400).json(result);
}

exports.getAvailability = (req, res) => {
  const result = availabilityService.getAvailability();

  res.status( result.success? 200 : 400).json(result);
}