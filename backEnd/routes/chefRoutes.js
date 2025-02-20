// routes/chefRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllChefs,
  getChefById,
  updateChefProfile,
  deleteChefProfile
} = require('../controllers/chefController');
const { protect } = require('../middleware/authMiddleware');

// No auth required to view chefs
router.get('/', getAllChefs);
router.get('/:id', getChefById);

// Protected routes - only Chef or Admin should update or delete
router.put('/:id', protect, updateChefProfile);
router.delete('/:id', protect, deleteChefProfile);

module.exports = router;