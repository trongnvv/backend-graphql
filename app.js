require('dotenv').config();
const logger = require('morgan');
const routers = require('./src/routes');
const express = require('express');
const cors = require('cors');
const httpError = require('http-errors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use('/api/v1/', routers);

// connect DB
require('./config/db');
require('./src/graphql')(app);

app.use(function (req, res, next) {
  next(httpError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || err.code || 500);
  res.json(err);
});

module.exports = app;