const express = require('express');
const { body } = require('express-validator');

const feedController = require('../controllers/feed');

const router = express.Router();

// GET /feed/posts
router.get('/posts', feedController.getPosts);

// POST /feed/post
router.post(
  '/post',
  [
    // Setting title min length to 7 even though it's 5 in front-end validation, just to test error handling middleware (change back later)
    body('title').trim().isLength({ min: 7 }),
    body('content').trim().isLength({ min: 5 }),
  ],
  feedController.createPost
);

module.exports = router;
