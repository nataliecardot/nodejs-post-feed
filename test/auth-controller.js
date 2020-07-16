const { expect } = require('chai');
const sinon = require('sinon')

const User = require('../models/user')
const AuthController = require('../controllers/auth')

describe('Auth controller - login', () => {
  if('should throw an error with status code 500 if accessing database fails', () => {
    sinon.stub(User, 'findOne')
    // Force an error to be thrown
    User.findOne.throws();

    // login is an async function (promises used within it); added complexity
    expect(AuthController.login)

    User.findOne.restore()
  })
})