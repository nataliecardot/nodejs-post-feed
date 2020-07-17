const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

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
      // Signal to Mocha that it should wait for this code to execute before treating this test case (inside the it method) as done (otherwise would have a false test pass, because Mocha wouldn't wait for test case finish since there is async code)
      done();
    });

    User.findOne.restore();
  });

  it('should send a response with a valid user status for an existing user', (done) => {
    mongoose
      .connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-4yuid.mongodb.net/test-feed`,
        {
          useUnifiedTopology: true,
          useNewUrlParser: true,
        }
      )
      .then((result) => {
        const user = new User({
          email: 'test@test.com',
          password: 'tester',
          name: 'Test',
          posts: [],
          _id: '5c0f66b979af55031b34728a',
          // status doesn't need to be set because there's a default defined
        });
        return user.save();
      })
      .then((result) => {
        const req = { userId: '5c0f66b979af55031b34728a' };
        const res = {
          statusCode: 500,
          userStatus: null,
          status(code) {
            this.statusCode = code;
            return this;
          },
          json(data) {
            this.userStatus = data.status;
          },
        };
        AuthController.getUserStatus(req, res, () => {}).then((result) => {
          expect(res.statusCode).to.be.equal(200);
          expect(res.userStatus).to.be.equal(`I'm new!`);
          done();
        });
      })
      .catch((err) => console.log(err));
  });
});
