exports.getPosts = (req, res, next) => {
  // json() is Express method for conveniently returning a response with JSON data with correct headers (Content-Type: application/json) set, etc.
  // Setting the appropriate status code is important (even though 200 is the default, better to be clear) because in REST API client depends on the code to know which UI to display (especially important to set error code), unlike in non-REST API/traditional web app in which you render views on the server so client doesn't need to know status code
  res.status(200).json({
    posts: [
      {
        _id: '1',
        title: 'First Post',
        content: 'This is the first post!',
        imageUrl: 'images/plant.jpg',
        creator: {
          name: 'Jane',
        },
        createdAt: new Date(),
      },
    ],
  });
};

exports.createPost = (req, res, next) => {
  const { title, content } = req.body;
  // Create post in db
  // 201: success, resource was created
  res.status(201).json({
    message: 'Post created successfully',
    post: {
      _id: new Date().toISOString(),
      title,
      content,
      creator: { name: 'Jane' },
      createdAt: new Date(),
    },
  });
};
