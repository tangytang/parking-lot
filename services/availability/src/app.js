const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use('/api/availability', routes)

app.listen(3004, () => {
  console.log('Availability service started on port 3004');
})