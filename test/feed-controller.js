const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const FeedController = require('../controllers/feed');

// Tells server to load anything in .env file into an environment variable
require('dotenv').config();

describe('Feed controller', () => {
  // Mocha before method (a lifecycle hook) executes once per test run; not before every test case, but before all test cases
  before((done) => {
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
      .then(() => {
        done();
      });
  });

  // Runs more often than before method; runs before every it() function call. Useful if need to reset something before every test case/if some initialization must be run before every test case
  beforeEach(() => {});

  // For cleanup work that needs to be done after every test case
  afterEach(() => {});

  // For this test case to run successfully, must first comment out each of the code blocks with io.getIO() in feed controller
  it('should add a created post to the posts of the creator', (done) => {
    const req = {
      body: {
        title: 'Test Post',
        content: 'A test post',
      },
      file: {
        path: 'abc',
      },
      // Using hardcoded ID from test user created above
      userId: '5c0f66b979af55031b34728a',
    };
    // returning res as value of status to create a method chain; using res.status(200).json() in feed controller; json must be called on res since it's an Express method on the response object
    const res = {
      status: () => res,
      // Also works (the value of this is determined by method invocation, and it's res, scoped to the object in which status is defined)
      // status() {
      //   return this;
      // },
      // Does not work, because this wouldn't be set to res object. Arrow functions within an object literal don't have object literal as value of this; instead, this refers to parent scope outside the enclosing object literal (the global "this")
      // status: () => this
      json: () => {},
    };

    FeedController.createPost(req, res, () => {}).then((savedUser) => {
      expect(savedUser).to.have.property('posts');
      expect(savedUser.posts).to.have.length(1);
      done();
    });
  });

  after((done) => {
    // Deletes all documents in users collection (if you have a test with dummy data, clean up after test, to ensure clean setup for next test run)
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});
