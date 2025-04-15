// controllers/favoriteController.js
const User = require('../models/User');
const mongoose = require('mongoose');

/**
 * @desc    Add a chef to user's favorites
 * @route   POST /api/favorites
 * @access  Private
 */
exports.addFavorite = async (req, res) => {
  try {
    const { chefId } = req.body;

    if (!chefId) {
      return res.status(400).json({ message: 'Please provide a chef ID' });
    }

    // Check if the chef exists
    const chef = await User.findOne({ _id: chefId, role: 'Chef' });
    if (!chef) {
      return res.status(404).json({ message: 'Chef not found' });
    }

    // Get current user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize userProfile.favoriteChefs if it doesn't exist
    if (!user.userProfile) {
      user.userProfile = {};
    }
    
    if (!user.userProfile.favoriteChefs) {
      user.userProfile.favoriteChefs = [];
    }

    // Check if already favorited
    if (user.userProfile.favoriteChefs.includes(chefId)) {
      return res.status(400).json({ message: 'Chef is already in favorites' });
    }

    // Add to favorites
    user.userProfile.favoriteChefs.push(chefId);
    await user.save();

    // Return a list of favorite chefs with their basic information
    const favoriteChefs = await User.find(
      { _id: { $in: user.userProfile.favoriteChefs } },
      'name profilePicture chefProfile.specialty'
    );

    res.status(200).json({
      message: 'Chef added to favorites',
      favoriteChefs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get user's favorite chefs
 * @route   GET /api/favorites
 * @access  Private
 */
exports.getFavoriteChefs = async (req, res) => {
  try {
    // Get user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Handle case where userProfile or favoriteChefs might not exist
    if (!user.userProfile || !user.userProfile.favoriteChefs || user.userProfile.favoriteChefs.length === 0) {
      return res.status(200).json({ favoriteChefs: [] });
    }

    // Get favorite chefs with their information
    const favoriteChefs = await User.find(
      { _id: { $in: user.userProfile.favoriteChefs } },
      'name profilePicture chefProfile.specialty chefProfile.experience chefProfile.location chefProfile.bio'
    );

    res.status(200).json({ favoriteChefs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Remove chef from favorites
 * @route   DELETE /api/favorites/:chefId
 * @access  Private
 */
exports.removeFavorite = async (req, res) => {
  try {
    const { chefId } = req.params;

    // Get user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Handle case where userProfile or favoriteChefs might not exist
    if (!user.userProfile || !user.userProfile.favoriteChefs) {
      return res.status(400).json({ message: 'No favorites found' });
    }

    // Check if chef is in favorites
    if (!user.userProfile.favoriteChefs.includes(chefId)) {
      return res.status(400).json({ message: 'Chef is not in favorites' });
    }

    // Remove from favorites
    user.userProfile.favoriteChefs = user.userProfile.favoriteChefs.filter(
      id => id.toString() !== chefId
    );
    
    await user.save();

    // Get updated list of favorite chefs
    const favoriteChefs = await User.find(
      { _id: { $in: user.userProfile.favoriteChefs } },
      'name profilePicture chefProfile.specialty'
    );

    res.status(200).json({
      message: 'Chef removed from favorites',
      favoriteChefs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Check if a chef is in user's favorites
 * @route   GET /api/favorites/check/:chefId
 * @access  Private
 */
exports.checkFavoriteStatus = async (req, res) => {
  try {
    const { chefId } = req.params;

    // Get user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if chef is in favorites (accounting for null/undefined values)
    const isFavorite = user.userProfile && 
                      user.userProfile.favoriteChefs && 
                      user.userProfile.favoriteChefs.some(id => id.toString() === chefId);

    res.status(200).json({ isFavorite });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get chefs who have favorited a specific chef
 * @route   GET /api/favorites/chef/:chefId/followers
 * @access  Private (Chef Only)
 */
exports.getChefFollowers = async (req, res) => {
  try {
    const { chefId } = req.params;
    
    // Basic validation
    if (!chefId) {
      return res.status(400).json({ message: 'Chef ID is required' });
    }
    
    // Verify the requesting user is the chef
    if (req.user.id !== chefId && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to view this information' });
    }
    
    // Find users who have this chef in their favorites
    const followers = await User.find({
      'userProfile.favoriteChefs': chefId
    })
    .select('name email profilePicture')
    .limit(10); // Limit results for performance

    // Return the followers data
    res.status(200).json({
      followers,
      count: followers.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};