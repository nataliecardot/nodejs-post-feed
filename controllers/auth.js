const { validationResult } = require('express-validator');

const User = require('../models/user');

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    // Keep errors that were retrieved by validation package
    error.data = errors.array();
    throw error;
  }
  const { email, name, password } = req.body;
};

exports.signup = (req, res, next) => {};
