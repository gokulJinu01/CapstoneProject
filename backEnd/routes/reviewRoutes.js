// routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const {
  createReview,
  getChefReviews,
  getReviewById,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const auth = require('../middleware/auth');

// Sample mock reviews for chefs
const generateMockReviews = (chefId, count = 5) => {
  const reviews = [];
  const userNames = ['Michael Scott', 'Jim Halpert', 'Pam Beesly', 'Dwight Schrute', 'Angela Martin', 
                     'Kevin Malone', 'Oscar Martinez', 'Stanley Hudson', 'Phyllis Vance', 'Meredith Palmer',
                     'Ryan Howard', 'Kelly Kapoor', 'Toby Flenderson', 'Creed Bratton', 'Jan Levinson'];
  
  const comments = [
    'Absolutely amazing experience! The food was incredible and the chef was very professional.',
    'Exceptional service and delicious food. Will definitely book again!',
    'A wonderful culinary experience. The chef was friendly and made our event special.',
    'Great food and presentation. Everyone at our party was impressed.',
    'The chef was amazing! Created a custom menu for our dietary restrictions and everything was delicious.',
    'Fantastic experience from start to finish. The chef was punctual, professional, and the food was outstanding.',
    'Exceeded our expectations! The chef was knowledgeable and the food was restaurant quality.',
    'A truly memorable dining experience. The chef explained each dish and used the freshest ingredients.',
    'Wonderful chef who created an outstanding meal. Very accommodating and professional.',
    'The food was absolutely delicious and the chef was a pleasure to work with. Highly recommend!',
    'The chef was incredibly talented and personable. The meal was a highlight of our celebration.',
    'An amazing culinary experience! The chef was creative and the presentation was beautiful.',
    'Excellent service and phenomenal food. The chef went above and beyond to make our event special.',
    'The chef was punctual, professional, and the food was outstanding. Would book again in a heartbeat.',
    'A delightful experience! The chef was knowledgeable about the cuisine and created memorable dishes.'
  ];
  
  for (let i = 1; i <= count; i++) {
    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 180)); // Random date within last 6 months
    
    const randomName = userNames[Math.floor(Math.random() * userNames.length)];
    const randomComment = comments[Math.floor(Math.random() * comments.length)];
    const randomRating = (Math.random() * (5 - 3) + 3).toFixed(1); // Random rating between 3 and 5
    
    reviews.push({
      _id: `r${chefId}${i}`,
      user: {
        _id: `u${i}`,
        name: randomName,
        profileImage: `https://i.pravatar.cc/150?u=${chefId}${i}`
      },
      chef: chefId,
      rating: parseFloat(randomRating),
      comment: randomComment,
      createdAt: randomDate.toISOString(),
      updatedAt: randomDate.toISOString()
    });
  }
  
  return reviews;
};

// Cache the reviews to avoid regenerating them on every request
const mockReviewsCache = {};

/**
 * @route   GET /api/reviews/chef/:chefId
 * @desc    Get reviews for a specific chef
 * @access  Public
 */
router.get('/chef/:chefId', (req, res) => {
  const { chefId } = req.params;
  
  // Generate reviews if not already cached
  if (!mockReviewsCache[chefId]) {
    // Generate between 3 and 10 reviews for each chef
    const reviewCount = Math.floor(Math.random() * 8) + 3;
    mockReviewsCache[chefId] = generateMockReviews(chefId, reviewCount);
  }
  
  res.status(200).json({
    reviews: mockReviewsCache[chefId],
    count: mockReviewsCache[chefId].length
  });
});

/**
 * @route   GET /api/reviews/testimonials
 * @desc    Get featured testimonials for the home page
 * @access  Public
 */
router.get('/testimonials', (req, res) => {
  // Generate featured testimonials from reviews of chefs 1, 2, 3, 4
  const testimonials = [];
  
  for (let i = 1; i <= 4; i++) {
    if (!mockReviewsCache[i]) {
      mockReviewsCache[i] = generateMockReviews(i, 5);
    }
    
    // Select a good review (4.5+ rating)
    const goodReviews = mockReviewsCache[i].filter(review => review.rating >= 4.5);
    if (goodReviews.length > 0) {
      testimonials.push(goodReviews[Math.floor(Math.random() * goodReviews.length)]);
    }
  }
  
  res.status(200).json({
    testimonials,
    count: testimonials.length
  });
});

/**
 * @route   POST /api/reviews
 * @desc    Create a new review
 * @access  Private
 */
router.post('/', auth(['User']), (req, res) => {
  const { chefId, rating, comment } = req.body;
  
  if (!chefId || !rating || !comment) {
    return res.status(400).json({ message: 'Please provide chef ID, rating, and comment' });
  }
  
  const newReview = {
    _id: `r${Date.now()}`,
    user: {
      _id: req.user.id,
      name: req.user.name,
      profileImage: req.user.profileImage || `https://i.pravatar.cc/150?u=${req.user.id}`
    },
    chef: chefId,
    rating: parseFloat(rating),
    comment,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Add to cache
  if (!mockReviewsCache[chefId]) {
    mockReviewsCache[chefId] = [];
  }
  
  mockReviewsCache[chefId].push(newReview);
  
  res.status(201).json({
    message: 'Review created successfully',
    review: newReview
  });
});

// Public routes
router.get('/:id', getReviewById);

// Protected routes
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;