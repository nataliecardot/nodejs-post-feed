const { expect } = require('chai');
const sinon = require('sinon');

const User = require('../models/user');
const AuthController = require('../controllers/auth');

describe('Auth controller - login', () => {
  it('should throw an error with status code 500 if accessing database fails', (done) => {
    // done argument is optional and is a function that can be called once test case is done. By default it's done once executed from top to bottom, but with this arg, Mocha will wait for done to be called, then you can call it in an async code snippet
    sinon.stub(User, 'findOne');
    // Force an error to be thrown
    User.findOne.throws();

    const req = {
      body: {
        email: 'test@test.com',
        password: 'tester',
      },
    };

    AuthController.login(req, {}, () => {}).then((result) => {
      expect(result).to.be.an('error');
      expect(result).to.have.property('statusCode', 500);
      // Signal to Mocha that it should wait for this code to execute before treating this test case (inside the it method) as done
      done();
    });

    User.findOne.restore();
  });
});
