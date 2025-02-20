// routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const { createReview, getChefReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Create a review (authenticated users)
router.post('/', protect, createReview);

// Get reviews by chefId
router.get('/:chefId', getChefReviews);

module.exports = router;