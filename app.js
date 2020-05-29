const express = require('express');
const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed');

const app = express();

// Middleware needed to parse incoming JSON data so can extract it on the request body (body parser adds body field on incoming request)
// app.use(bodyParser.urlencoded()); // For x-www-form-urlencoded, default format for data sent via form post request
app.use(bodyParser.json()); // application/json

app.use('/feed', feedRoutes);

app.listen(8080);
