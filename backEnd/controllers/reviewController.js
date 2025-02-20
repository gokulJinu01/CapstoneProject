// controllers/reviewController.js
const Review = require('../models/Review');
const User = require('../models/User');

/**
 * POST /api/reviews
 * Creates a new review for a chef
 */
exports.createReview = async (req, res) => {
  try {
    const { chefId, rating, comment } = req.body;

    // Ensure chef exists
    const chef = await User.findOne({ _id: chefId, role: 'Chef' });
    if (!chef) {
      return res.status(404).json({ message: 'Chef not found' });
    }

    const newReview = await Review.create({
      chef: chefId,
      user: req.user.id, // from auth middleware
      name: req.user.name || 'Anonymous', // or store user name
      rating,
      comment
    });

    res.status(201).json({ message: 'Review created', review: newReview });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/reviews/:chefId
 * Gets all reviews for a specific chef
 */
exports.getChefReviews = async (req, res) => {
  const { chefId } = req.params;
  try {
    // Make sure user is a Chef
    const chef = await User.findOne({ _id: chefId, role: 'Chef' });
    if (!chef) {
      return res.status(404).json({ message: 'Chef not found' });
    }

    const reviews = await Review.find({ chef: chefId })
      .sort({ createdAt: -1 });
    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};