// controllers/favoriteController.js
const User = require('../models/User');

/**
 * POST /api/users/favorites
 * Add a chef to the user's favorites
 */
exports.addFavoriteChef = async (req, res) => {
  const { chefId } = req.body;
  try {
    // Check if the target user is actually a Chef
    const chef = await User.findOne({ _id: chefId, role: 'Chef' });
    if (!chef) {
      return res.status(404).json({ message: 'Chef not found' });
    }

    // Add to favorites
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Avoid duplicates
    if (!user.userProfile.favoriteChefs.includes(chefId)) {
      user.userProfile.favoriteChefs.push(chefId);
      await user.save();
    }

    res.status(200).json({ message: 'Chef added to favorites' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/users/favorites
 * Get all favorite chefs of the current user
 */
exports.getFavoriteChefs = async (req, res) => {
  try {
    // Populate favoriteChefs from user
    const user = await User.findById(req.user.id).populate('userProfile.favoriteChefs');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ favoriteChefs: user.userProfile.favoriteChefs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * DELETE /api/users/favorites/:chefId
 * Remove a chef from the user's favorites
 */
exports.removeFavoriteChef = async (req, res) => {
  const { chefId } = req.params;
  try {
    // Confirm that the user is valid
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.userProfile.favoriteChefs = user.userProfile.favoriteChefs.filter(
      (favId) => favId.toString() !== chefId
    );
    await user.save();

    res.status(200).json({ message: 'Chef removed from favorites' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};