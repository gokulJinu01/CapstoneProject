const User = require('../models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cloudinary = require('../config/cloudinary');

/**
 * @desc    Get current user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
exports.getCurrentProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('userProfile.favoriteChefs', 'name email chefProfile');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
exports.updateProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      dietary_preferences,
      allergies,
      bio,
      currentPassword,
      newPassword
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update basic info
    if (name) user.name = name;
    if (email && email !== user.email) {
      // Check if email is already taken
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      user.email = email;
    }

    // Update profile fields
    user.userProfile = {
      ...user.userProfile,
      phone: phone || user.userProfile.phone,
      address: address || user.userProfile.address,
      dietary_preferences: dietary_preferences || user.userProfile.dietary_preferences,
      allergies: allergies || user.userProfile.allergies,
      bio: bio || user.userProfile.bio
    };

    // Handle password update if provided
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      // Validate new password
      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters' });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(user._id)
      .select('-password')
      .populate('userProfile.favoriteChefs', 'name email chefProfile');

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Upload profile image
 * @route   POST /api/users/profile/image
 * @access  Private
 */
exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const file = req.files.image;

    // Validate file type
    if (!file.mimetype.startsWith('image')) {
      return res.status(400).json({ message: 'Please upload an image file' });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ message: 'Image must be less than 5MB' });
    }

    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: 'profiles',
      width: 300,
      crop: 'scale'
    });

    // Update user profile
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        'userProfile.profileImage': result.secure_url
      },
      { new: true }
    ).select('-password');

    res.status(200).json({
      message: 'Profile image uploaded successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get user profile by ID
 * @route   GET /api/users/profile/:id
 * @access  Public
 */
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -email')
      .populate('userProfile.favoriteChefs', 'name chefProfile');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update chef profile
 * @route   PUT /api/users/chef/profile
 * @access  Private (Chef Only)
 */
exports.updateChefProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role !== 'Chef') {
      return res.status(403).json({ message: 'Only chefs can update chef profiles' });
    }

    const {
      specialty,
      bio,
      location,
      experience,
      cuisines,
      hourlyRate,
      availability,
      chefProfile // Allow passing the entire chefProfile object
    } = req.body;

    // Initialize chefProfile if it doesn't exist
    if (!user.chefProfile) {
      user.chefProfile = {};
    }

    // Update chef profile using spread operator if complete object is provided
    if (chefProfile && typeof chefProfile === 'object') {
      user.chefProfile = {
        ...user.chefProfile,
        ...chefProfile
      };
    } else {
      // Otherwise update individual fields
      if (specialty !== undefined) user.chefProfile.specialty = specialty;
      if (bio !== undefined) user.chefProfile.bio = bio;
      if (location !== undefined) user.chefProfile.location = location;
      if (experience !== undefined) user.chefProfile.experience = experience;
      if (cuisines !== undefined) user.chefProfile.cuisines = cuisines;
      if (hourlyRate !== undefined) user.chefProfile.hourlyRate = hourlyRate;
      if (availability !== undefined) user.chefProfile.availability = availability;
    }

    await user.save();

    // Return the updated user without sensitive information
    const updatedUser = await User.findById(req.user.id).select('-password');

    res.status(200).json({
      message: 'Chef profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all chefs
 * @route   GET /api/users/chefs
 * @access  Public
 */
exports.getAllChefs = async (req, res) => {
  try {
    const { 
      specialty, 
      location, 
      minRating, 
      priceRange, 
      availability,
      search,
      page = 1,
      limit = 10,
      featured
    } = req.query;

    // Build query
    let query = { role: 'Chef' };
    
    // Filter by specialty if provided
    if (specialty) {
      query['chefProfile.specialty'] = { $regex: specialty, $options: 'i' };
    }
    
    // Filter by location if provided
    if (location) {
      query['chefProfile.location'] = { $regex: location, $options: 'i' };
    }
    
    // Filter by minimum rating if provided
    if (minRating) {
      query['chefProfile.rating'] = { $gte: parseFloat(minRating) };
    }
    
    // Filter by price range if provided
    if (priceRange) {
      const [min, max] = priceRange.split('-');
      query['chefProfile.hourlyRate'] = {};
      if (min) query['chefProfile.hourlyRate'].$gte = parseFloat(min);
      if (max) query['chefProfile.hourlyRate'].$lte = parseFloat(max);
    }
    
    // Filter by availability if specified
    if (availability === 'true') {
      query['chefProfile.availability'] = true;
    }
    
    // Filter by featured if specified
    if (featured === 'true') {
      query['chefProfile.featured'] = true;
    }
    
    // Search by name or specialty
    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      query.$or = [
        { name: searchRegex },
        { 'chefProfile.specialty': searchRegex },
        { 'chefProfile.bio': searchRegex }
      ];
    }
    
    // Calculate pagination values
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;
    
    // Find chefs matching the query
    const chefs = await User.find(query)
      .select('name email profilePicture chefProfile')
      .skip(skip)
      .limit(limitNum);
    
    // Count total results for pagination
    const total = await User.countDocuments(query);

    return res.status(200).json({
      chefs,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete user account
 * @route   DELETE /api/users/profile
 * @access  Private
 */
exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password
    if (password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Password is incorrect' });
      }
    }

    // If user is a chef, handle related data (bookings, reviews, etc.)
    if (user.role === 'chef') {
      // TODO: Handle chef-related data cleanup
      // - Cancel future bookings
      // - Archive reviews
      // - Notify users who favorited this chef
    }

    // Delete user's profile image from cloudinary if exists
    if (user.userProfile.profileImage) {
      const publicId = user.userProfile.profileImage.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`profiles/${publicId}`);
    }

    await user.deleteOne();

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update notification preferences
 * @route   PUT /api/users/profile/notifications
 * @access  Private
 */
exports.updateNotificationPreferences = async (req, res) => {
  try {
    const {
      emailNotifications,
      pushNotifications,
      marketingEmails,
      bookingReminders,
      reviewNotifications
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.userProfile.notificationPreferences = {
      ...user.userProfile.notificationPreferences,
      emailNotifications: emailNotifications ?? user.userProfile.notificationPreferences?.emailNotifications,
      pushNotifications: pushNotifications ?? user.userProfile.notificationPreferences?.pushNotifications,
      marketingEmails: marketingEmails ?? user.userProfile.notificationPreferences?.marketingEmails,
      bookingReminders: bookingReminders ?? user.userProfile.notificationPreferences?.bookingReminders,
      reviewNotifications: reviewNotifications ?? user.userProfile.notificationPreferences?.reviewNotifications
    };

    await user.save();

    res.status(200).json({
      message: 'Notification preferences updated successfully',
      preferences: user.userProfile.notificationPreferences
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 