// controllers/reviewController.js
const Review = require('../models/Review');
const User = require('../models/User');

/**
 * @desc    Create a new review
 * @route   POST /api/reviews
 * @access  Private
 */
exports.createReview = async (req, res) => {
  try {
    const { chefId, rating, text, title } = req.body;

    // Validation
    if (!chefId || !rating || !text) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if chef exists
    const chef = await User.findOne({ _id: chefId, role: 'chef' });
    if (!chef) {
      return res.status(404).json({ message: 'Chef not found' });
    }

    // Check if user has already reviewed this chef
    const existingReview = await Review.findOne({
      chef: chefId,
      user: req.user.id
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this chef' });
    }

    // Create review
    const review = await Review.create({
      chef: chefId,
      user: req.user.id,
      userName: req.user.name,
      userImage: req.user.profileImage,
      rating,
      text,
      title
    });

    // Update chef's average rating
    const allReviews = await Review.find({ chef: chefId });
    const averageRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;
    
    await User.findByIdAndUpdate(chefId, {
      'chefProfile.rating': averageRating.toFixed(1),
      'chefProfile.reviewCount': allReviews.length
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all reviews for a chef
 * @route   GET /api/reviews/chef/:chefId
 * @access  Public
 */
exports.getChefReviews = async (req, res) => {
  try {
    const { chefId } = req.params;
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

    // Check if chef exists
    const chef = await User.findOne({ _id: chefId, role: 'chef' });
    if (!chef) {
      return res.status(404).json({ message: 'Chef not found' });
    }

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort,
      populate: {
        path: 'user',
        select: 'name profileImage'
      }
    };

    const reviews = await Review.paginate({ chef: chefId }, options);

    res.status(200).json({
      reviews: reviews.docs,
      totalPages: reviews.totalPages,
      currentPage: reviews.page,
      totalReviews: reviews.totalDocs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get review by ID
 * @route   GET /api/reviews/:id
 * @access  Public
 */
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('user', 'name profileImage')
      .populate('chef', 'name chefProfile');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update review
 * @route   PUT /api/reviews/:id
 * @access  Private
 */
exports.updateReview = async (req, res) => {
  try {
    const { rating, text, title } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check ownership
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Update review
    review.rating = rating || review.rating;
    review.text = text || review.text;
    review.title = title || review.title;
    review.edited = true;
    review.editedAt = Date.now();

    const updatedReview = await review.save();

    // Update chef's average rating
    const allReviews = await Review.find({ chef: review.chef });
    const averageRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;
    
    await User.findByIdAndUpdate(review.chef, {
      'chefProfile.rating': averageRating.toFixed(1)
    });

    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete review
 * @route   DELETE /api/reviews/:id
 * @access  Private
 */
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check ownership
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await review.deleteOne();

    // Update chef's average rating
    const allReviews = await Review.find({ chef: review.chef });
    const averageRating = allReviews.length > 0
      ? allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length
      : 0;
    
    await User.findByIdAndUpdate(review.chef, {
      'chefProfile.rating': averageRating.toFixed(1),
      'chefProfile.reviewCount': allReviews.length
    });

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get review statistics for a chef
 * @route   GET /api/reviews/stats/:chefId
 * @access  Public
 */
exports.getReviewStats = async (req, res) => {
  try {
    const { chefId } = req.params;

    // Check if chef exists
    const chef = await User.findOne({ _id: chefId, role: 'chef' });
    if (!chef) {
      return res.status(404).json({ message: 'Chef not found' });
    }

    const stats = await Review.aggregate([
      { $match: { chef: chef._id } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    // Format stats into rating distribution
    const distribution = {
      5: 0, 4: 0, 3: 0, 2: 0, 1: 0
    };

    stats.forEach(stat => {
      distribution[stat._id] = stat.count;
    });

    const totalReviews = Object.values(distribution).reduce((a, b) => a + b, 0);
    const averageRating = totalReviews > 0
      ? (Object.entries(distribution).reduce((acc, [rating, count]) => acc + (rating * count), 0) / totalReviews).toFixed(1)
      : 0;

    res.status(200).json({
      totalReviews,
      averageRating,
      distribution
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};