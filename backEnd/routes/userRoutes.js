const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getCurrentProfile,
    updateProfile,
    uploadProfileImage,
    getUserProfile,
    updateChefProfile,
    getAllChefs,
    deleteAccount,
    updateNotificationPreferences
} = require('../controllers/userController');

// Import favorites controller functions
const {
    getFavoriteChefs,
    addFavorite,
    removeFavorite,
    checkFavoriteStatus
} = require('../controllers/favoriteController');

// Public routes
router.get('/chefs', getAllChefs);
router.get('/chefs/:id', getUserProfile);

// Protected routes
router.get('/profile', protect, getCurrentProfile);
router.put('/profile', protect, updateProfile);
router.post('/profile/image', protect, uploadProfileImage);
router.put('/chef/profile', protect, authorize('Chef'), updateChefProfile);
router.delete('/account', protect, deleteAccount);
router.put('/notifications/preferences', protect, updateNotificationPreferences);

// Favorites routes within user namespace for backward compatibility
router.get('/favorites', protect, getFavoriteChefs);
router.post('/favorites', protect, addFavorite);
router.delete('/favorites/:chefId', protect, removeFavorite);
router.get('/favorites/check/:chefId', protect, checkFavoriteStatus);

module.exports = router; 