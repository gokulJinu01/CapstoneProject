// routes/chefRoutes.js
const express = require('express');
const router = express.Router();
const chefController = require('../controllers/chefController');
const auth = require('../middleware/auth');

/**
 * @route   GET /api/chefs
 * @desc    Get all chefs
 * @access  Public
 */
router.get('/', chefController.getAllChefs);

/**
 * @route   GET /api/chefs/cuisines
 * @desc    Get sample cuisines
 * @access  Public
 */
router.get('/cuisines', (req, res) => {
  const cuisinesList = [
    { value: 'french', label: 'French' },
    { value: 'italian', label: 'Italian' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'japanese', label: 'Japanese' },
    { value: 'indian', label: 'Indian' },
    { value: 'mexican', label: 'Mexican' },
    { value: 'mediterranean', label: 'Mediterranean' },
    { value: 'chinese', label: 'Chinese' },
    { value: 'thai', label: 'Thai' },
    { value: 'moroccan', label: 'Moroccan' },
    { value: 'persian', label: 'Persian' },
    { value: 'german', label: 'German' },
    { value: 'african', label: 'African' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'fusion', label: 'Fusion' },
    { value: 'pastry', label: 'Pastry & Desserts' }
  ];
  
  res.status(200).json({ cuisines: cuisinesList });
});

/**
 * @route   GET /api/chefs/:id
 * @desc    Get chef by ID
 * @access  Public
 */
router.get('/:id', chefController.getChefById);

/**
 * @route   PUT /api/chefs/:id
 * @desc    Update chef profile
 * @access  Private (Chef or Admin)
 */
router.put('/:id', auth(['Chef', 'Admin']), chefController.updateChefProfile);

/**
 * @route   DELETE /api/chefs/:id
 * @desc    Delete chef profile
 * @access  Private (Chef or Admin)
 */
router.delete('/:id', auth(['Chef', 'Admin']), chefController.deleteChefProfile);

// Return the router
module.exports = router;