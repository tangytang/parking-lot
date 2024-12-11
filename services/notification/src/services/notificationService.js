exports.sendNotification = (message, receipient) => {

  console.log(`Sending notification to ${receipient} with message: ${message}`);
  // Send a notification to the receipient
  return { success: true, message: `message '${message}' was sent to ${receipient}` };
}

