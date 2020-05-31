const express = require('express');
const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed');

const app = express();

// Middleware needed to parse incoming JSON data so can extract it on the request body (body parser adds body field on incoming request)
// app.use(bodyParser.urlencoded()); // For x-www-form-urlencoded, default format for data sent via form post request
app.use(bodyParser.json()); // application/json

// Set CORS headers to bypass CORS error, a default security mechanism set by browsers that occurs when the server-side web API (the back end, which has the API endpoints, the path and method, and defines the logic that should execute on the server when a request reaches them) and client (front end) are on different servers/domains and try to exchange data
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
