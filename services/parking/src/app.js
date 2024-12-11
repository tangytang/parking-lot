const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use('/api/parking', routes);


app.listen(3001, () => {
  console.log('Parking service is running on port 3001');
});

