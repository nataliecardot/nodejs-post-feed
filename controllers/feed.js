exports.getPosts = (req, res, next) => {
  // json() is an Express method for conveniently returning a response with JSON data with the correct headers (Content-Type: application/json) set, etc.
  // Setting the appropriate status code is important (even though 200 is the default, better to be clear) because in REST API client depends on the code to know which UI to display (especially important to set error code), unlike in a non-REST API/traditional web app where the UI is sent (for example with res.render() and a EJS template) so client doesn't need to know the status code
  res.status(200).json({
    posts: [{ title: 'First Post', content: 'This is the first post!' }],
  });
};
