// routes/favoriteRoutes.js
const express = require('express');
const router = express.Router();
const {
  addFavoriteChef,
  getFavoriteChefs,
  removeFavoriteChef
} = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');

// All favorites endpoints require authentication
router.post('/', protect, addFavoriteChef);
router.get('/', protect, getFavoriteChefs);
router.delete('/:chefId', protect, removeFavoriteChef);

module.exports = router;