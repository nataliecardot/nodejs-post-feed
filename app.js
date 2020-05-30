const express = require('express');
const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed');

const app = express();

// Middleware needed to parse incoming JSON data so can extract it on the request body (body parser adds body field on incoming request)
// app.use(bodyParser.urlencoded()); // For x-www-form-urlencoded, default format for data sent via form post request
app.use(bodyParser.json()); // application/json

// Want to offer data from this server to clients served by a different server (front and back end are typically served on different servers); set CORS headers to override CORS error when different domain tries to send an HTTP request to this server using fetch method. CORS (exchange of data between client and server [sending requests and responses] running on different domains [for example localhost:3000 and localhost:8080; port number is part of domain]) not allowed by browsers by default
app.use((req, res, next) => {
  // Allow data/content to be accessed by specific origins/clients (all in this case)
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Allow these origins to use specific HTTP methods
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  // Headers clients can use on requests
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/feed', feedRoutes);

app.listen(8080);
