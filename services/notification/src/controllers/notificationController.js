const notificationService = require('../services/notificationService');

exports.sendNotification = (req, res) => {
  const { message, receipient } = req.body;
  const result = notificationService.sendNotification(message, receipient);
  res.status(result.success ? 200 : 400).json(result);
}