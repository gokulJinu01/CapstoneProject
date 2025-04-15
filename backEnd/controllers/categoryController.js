const Category = require('../models/Category');
const Menu = require('../models/Menu');
const User = require('../models/User');

/**
 * @desc    Create new chef category/specialty
 * @route   POST /api/categories
 * @access  Private (Admin)
 */
exports.createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({ name: { $regex: new RegExp(name, 'i') } });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = await Category.create({
      name,
      description,
      image
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all chef categories/specialties
 * @route   GET /api/categories
 * @access  Public
 */
exports.getCategories = async (req, res) => {
  try {
    const { sort = 'name' } = req.query;
    const categories = await Category.find().sort(sort);

    // Get count of chefs for each category
    const categoriesWithStats = await Promise.all(
      categories.map(async (category) => {
        const chefCount = await User.countDocuments({
          role: 'chef',
          'chefProfile.specialties': category._id
        });

        return {
          ...category.toObject(),
          chefCount
        };
      })
    );

    res.status(200).json(categoriesWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get category by ID
 * @route   GET /api/categories/:id
 * @access  Public
 */
exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Get associated chefs
    const chefs = await User.find({
      role: 'chef',
      'chefProfile.specialties': category._id
    })
    .select('name email chefProfile')
    .sort('-chefProfile.rating')
    .limit(5);

    res.status(200).json({
      category,
      chefs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update category
 * @route   PUT /api/categories/:id
 * @access  Private (Admin)
 */
exports.updateCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if new name already exists
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ 
        name: { $regex: new RegExp(name, 'i') },
        _id: { $ne: category._id }
      });
      if (existingCategory) {
        return res.status(400).json({ message: 'Category name already exists' });
      }
    }

    category.name = name || category.name;
    category.description = description || category.description;
    category.image = image || category.image;

    await category.save();

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete category
 * @route   DELETE /api/categories/:id
 * @access  Private (Admin)
 */
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if category is in use by any chefs
    const chefCount = await User.countDocuments({
      'chefProfile.specialties': category._id
    });

    if (chefCount > 0) {
      return res.status(400).json({
        message: 'Category cannot be deleted as it is being used by chefs',
        chefCount
      });
    }

    await category.deleteOne();

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get category statistics
 * @route   GET /api/categories/stats
 * @access  Private (Admin)
 */
exports.getCategoryStats = async (req, res) => {
  try {
    // Get total counts
    const totalCategories = await Category.countDocuments();
    
    // Get most popular categories (by chef count)
    const popularCategories = await User.aggregate([
      { $match: { role: 'chef' } },
      { $unwind: '$chefProfile.specialties' },
      {
        $group: {
          _id: '$chefProfile.specialties',
          chefCount: { $sum: 1 }
        }
      },
      { $sort: { chefCount: -1 } },
      { $limit: 5 }
    ]);

    // Populate category details for popular categories
    const populatedPopularCategories = await Category.populate(
      popularCategories,
      { path: '_id', select: 'name description' }
    );

    res.status(200).json({
      totalCategories,
      popularCategories: populatedPopularCategories
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get chefs by category
 * @route   GET /api/categories/:id/chefs
 * @access  Public
 */
exports.getCategoryChefs = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = '-chefProfile.rating' } = req.query;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const chefs = await User.find({
      role: 'chef',
      'chefProfile.specialties': category._id
    })
    .select('name email chefProfile')
    .sort(sort)
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await User.countDocuments({
      role: 'chef',
      'chefProfile.specialties': category._id
    });

    res.status(200).json({
      chefs,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get menus by category
 * @route   GET /api/categories/:id/menus
 * @access  Public
 */
exports.getCategoryMenus = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const menus = await Menu.find({ cuisine: category._id })
      .populate('chef', 'name chefProfile')
      .populate('items')
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Menu.countDocuments({ cuisine: category._id });

    res.status(200).json({
      menus,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 