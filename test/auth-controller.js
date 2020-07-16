const { expect } = require('chai');
const sinon = require('sinon');

const User = require('../models/user');
const AuthController = require('../controllers/auth');

describe('Auth controller - login', () => {
  it(
    ('should throw an error with status code 500 if accessing database fails',
    () => {
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
        console.log(result);
        expect(result).to.be.an('error');
        expect(result).to.have.property('statusCode', 500);
      });

      User.findOne.restore();
    })
  );
});
