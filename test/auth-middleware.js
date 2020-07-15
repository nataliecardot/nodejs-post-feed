const { expect } = require('chai');

const authMiddleware = require('../middleware/is-auth');

// Unit test: testing one unit of the application (typically, a unit is a function), here it's the middleware function (an integration test would be a test of a more complete flow [for example, whether a request is routed correctly, the middleware, and the controller function]. However it's very complex to test long chains like this so this is not done often). Unit tests allow you to test different scenarios for each unit and determine why it fails in the case that it does

// Mocha provides describe function to group tests (they can be nested)
// describe takes a title, which is like a header for group being tested. All test cases are passed into second arg, a callback function
describe('Auth middleware', () => {
  it('should throw an error if no authorization header is present', () => {
    const req = {
      get(headerName) {
        return null;
      },
    };
    // Can't call directly (would just get the error being checked for, but it won't be handled, with the test shown as passing/failed); allow Mocha/Chai to call, passing reference to function. Using arrow function as alternative to binding with 'this' as this value, since arrow functions have lexical context (arrow functions do not bind their own this; instead, they inherit the one from the parent scope, which is called "lexical scoping")
    expect(() => authMiddleware(req, {}, () => {})).to.throw(
      'Not authenticated.'
    );
  });

  it('should throw an error if authorization header value is a string without a space', () => {
    const req = {
      get(headerName) {
        // The correct value of authorization header is in the format 'Bearer xxxxx.yyyyy.zzzzz'. This is split into array of substrings using the space as a separator, with the second string in the array becoming the token value. If you only have a string without a space as the header value, and therefore there is no second substring in the array, an error 'JsonWebTokenError: jwt must be provided' is thrown
        return 'xyz';
      },
    };
    expect(() => authMiddleware(req, {}, () => {})).to.throw();
  });
});
