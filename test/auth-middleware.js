const { expect } = require('chai');

const authMiddleware = require('../middleware/is-auth');

// Unit test: testing one unit of the application (typically, a unit is a function), here it's the middleware function (an integration test would be a test of a more complete flow [for example, whether a request is routed correctly, the middleware, and the controller function]. However it's very complex to test long chains like this so this is not done often). Unit tests allow you to test different scenarios for each unit and determine why it fails in the case that it does

it('should throw an error if no authorization header is present', () => {
  const req = {
    get() {
      return null;
    },
  };
  // Passing empty dummy object for response since not testing anything related to it, and the code we're testing doesn't use it. Passing empty arrow function in place of next() call
  expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
    'Not authenticated.'
  );
});
