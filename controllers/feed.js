const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');

const Post = require('../models/post');
const User = require('../models/user');

// Note: Starting with Node.js v 14.3.0, released 5/20, you can use await keyword outside of an asynchronous function, without async, a feature called top-level await. await a promise in top level of script, not inside of a function. Previously always needed async function around await. But if you are using it inside of a function, still need async

exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  // Behind the scenes, async/await is converted to then/catch. Async/await makes async code appear synchronous for better readibility. So can use try/catch instead of then/catch
  try {
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find()
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    // Note using destructuring in json method (e.g., post instead of posts: posts)
    res
      .status(200)
      .json({ message: 'Fetched posts successfully.', posts, totalItems });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    // Can't throw error since in async code/catch block of promise chain (if you throw error inside of then block, the subsequent catch block will be reached, and that error will be passed as an error to the catch block). Passing err to next() reaches next error handling Express middleware
    next(err);
  }
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed; entered data is incorrect.');
    error.statusCode = 422;
    // Since not in async code, automatically exits function execution and instead tries to reach next error handling middleware provided in Express application
    throw error;
  }
  if (!req.file) {
    const error = new Error('No image provided.');
    error.statusCode = 422;
    throw error;
  }
  const imageUrl = req.file.path.replace('\\', '/');
  const { title, content } = req.body;
  let creator;
  const post = new Post({
    title,
    content,
    imageUrl,
    // userId was stored in request object, extracted from decoded token in is-auth middleware
    // Will be a string, not an ObjectId, but Mongoose converts it behind the scenes
    creator: req.userId,
  });
  post
    .save()
    .then((result) => {
      // Add post to list of posts for given user
      return User.findById(req.userId);
    })
    .then((user) => {
      // user object is a Mongoose model in the end, and it has a posts property
      creator = user;
      // Mongoose will do all the heavy lifting of pulling out the post id and adding it to the user
      user.posts.push(post);
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: 'Post created successfully',
        post,
        creator: { _id: creator._id, name: creator.name },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
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
        // If you throw error inside of then block, the subsequent catch block will be reached, and that error will be passed as an error to the catch block
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

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed; entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  const { title, content } = req.body;
  // Two options when updated: 1) (default) imageUrl is part of incoming request and it's just some text in request body. That would be the case if no new file was added; then front end code has logic to keep existing URL 2) picked file; req.file would be set
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path.replace('\\', '/');
  }
  if (!imageUrl) {
    const error = new Error('No image file added.');
    error.statusCode = 422;
    throw error;
  }
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('No post found.');
        error.statusCode = 404;
        throw error;
      }
      // creator: ID of user that created post, req.userId was extracted from token
      if (post.creator.toString() !== req.userId) {
        const error = new Error('Not authorized.');
        error.statusCode = 403; // Forbidden (see https://dev.to/adarshkkumar/http-status-401-vs-403-2c59)
        throw error;
      }
      if (imageUrl !== post.imageUrl) {
        // clearImage is utility function defined in this file
        clearImage(post.imageUrl);
      }
      post.title = title;
      post.imageUrl = imageUrl;
      post.content = content;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({ message: 'Post updated.', post: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('No post found.');
        error.statusCode = 404;
        throw error;
      }
      // Verify that post author is same as logged-in user
      if (post.creator.toString() !== req.userId) {
        const error = new Error('Not authorized.');
        error.statusCode = 403;
        throw error;
      }
      clearImage(post.imageUrl);
      return Post.findByIdAndRemove(postId);
    })
    // Clear relation between user and post (i.e., post id stored in user collection)
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user.posts.pull(postId);
      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: 'Post deleted.' });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
