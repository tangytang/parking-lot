const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use('/api/notification', routes);

app.listen(3003, () => {
  console.log('Notification service is running on port 3003');
})