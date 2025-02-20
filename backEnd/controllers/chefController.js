// controllers/chefController.js
const User = require('../models/User');

/**
 * GET /api/chefs
 * Retrieves a list of all users with role 'Chef'
 */
exports.getAllChefs = async (req, res) => {
  try {
    const chefs = await User.find({ role: 'Chef' }).select('-password').lean();
    res.status(200).json({ chefs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/chefs/:id
 * Retrieves a single chef by their User ID
 */
exports.getChefById = async (req, res) => {
  const { id } = req.params;
  try {
    const chef = await User.findOne({ _id: id, role: 'Chef' })
      .select('-password')
      .lean();
    if (!chef) {
      return res.status(404).json({ message: 'Chef not found' });
    }
    res.status(200).json({ chef });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * PUT /api/chefs/:id
 * Updates chef-specific fields
 */
exports.updateChefProfile = async (req, res) => {
  const { id } = req.params;
  try {
    // Confirm Chef
    const existingChef = await User.findOne({ _id: id, role: 'Chef' });
    if (!existingChef) {
      return res.status(404).json({ message: 'Chef not found or not a chef' });
    }

    // Only update relevant fields
    const updates = {
      name: req.body.name,
      email: req.body.email,
      'chefProfile.specialty': req.body.chefProfile?.specialty,
      'chefProfile.experience': req.body.chefProfile?.experience,
      'chefProfile.bio': req.body.chefProfile?.bio,
      'chefProfile.location': req.body.chefProfile?.location,
      'chefProfile.pricing': req.body.chefProfile?.pricing,
      'chefProfile.availability': req.body.chefProfile?.availability,
      'chefProfile.socialLinks': req.body.chefProfile?.socialLinks,
      'chefProfile.gallery': req.body.chefProfile?.gallery
    };

    const updatedChef = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    }).select('-password');

    res.status(200).json({
      message: 'Chef profile updated successfully',
      chef: updatedChef
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * DELETE /api/chefs/:id
 * Deletes a chef’s profile
 */
exports.deleteChefProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const chef = await User.findOneAndDelete({ _id: id, role: 'Chef' });
    if (!chef) {
      return res.status(404).json({ message: 'Chef not found' });
    }
    res.status(200).json({ message: 'Chef profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};