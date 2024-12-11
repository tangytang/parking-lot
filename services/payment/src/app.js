const express = require('express');
const bodyParser = require('body-parser');
const router = require('./router')

const app = express();

app.use(bodyParser.json());
app.use('/api/payment', router);

app.listen(3002, () => {
  console.log('Payment service is running on port 3002!');
})

