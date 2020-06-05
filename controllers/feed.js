const { validationResult } = require('express-validator');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      // Note using destructuring in json method, post instead of posts: posts
      res.status(200).json({ message: 'Fetched posts successfully.', posts });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed; entered data is incorrect.');
    error.statusCode = 422;
    // Since not in async code, automatically exits function execution and instead tries to reach next error handling middleware provided in Express application
    throw error;
  }
  const { title, content } = req.body;
  const post = new Post({
    title,
    content,
    imageUrl: 'images/plant.jpg',
    creator: { name: 'Jane' },
  });
  post
    .save()
    .then((result) => {
      // 201: success, resource was created
      res.status(201).json({
        message: 'Post created successfully',
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      // Can't throw error since in async code/promise chain. Passing err to next() reaches next error handling Express middleware
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('No post found.');
        error.statusCode = 404;
        // If you throw error inside of then block, next catch block will be reached, and that error will be passed as an error to the catch block
        throw error;
      }
      res.status(200).json({ message: 'Post fetched.', post });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
