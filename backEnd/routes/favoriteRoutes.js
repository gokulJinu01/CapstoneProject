// routes/favoriteRoutes.js
const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');

// Make sure all controller functions exist before using them
if (!favoriteController.addFavorite) {
  console.error("Warning: addFavorite function is not defined in favoriteController");
}

if (!favoriteController.getFavoriteChefs) {
  console.error("Warning: getFavoriteChefs function is not defined in favoriteController");
}

if (!favoriteController.removeFavorite) {
  console.error("Warning: removeFavorite function is not defined in favoriteController");
}

if (!favoriteController.checkFavoriteStatus) {
  console.error("Warning: checkFavoriteStatus function is not defined in favoriteController");
}

// All favorites endpoints require authentication
router.post('/', protect, favoriteController.addFavorite || ((req, res) => res.status(501).json({ message: 'Not implemented' })));
router.get('/', protect, favoriteController.getFavoriteChefs || ((req, res) => res.status(501).json({ message: 'Not implemented' })));
router.get('/check/:chefId', protect, favoriteController.checkFavoriteStatus || ((req, res) => res.status(501).json({ message: 'Not implemented' })));
router.get('/chef/:chefId/followers', protect, favoriteController.getChefFollowers || ((req, res) => res.status(501).json({ message: 'Not implemented' })));
router.delete('/:chefId', protect, favoriteController.removeFavorite || ((req, res) => res.status(501).json({ message: 'Not implemented' })));

module.exports = router;