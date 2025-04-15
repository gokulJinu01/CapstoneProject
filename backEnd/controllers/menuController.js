const Menu = require('../models/Menu');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');

/**
 * @desc    Create a new menu
 * @route   POST /api/menus
 * @access  Private (Chef Only)
 */
exports.createMenu = async (req, res) => {
  try {
    const { name, description, type, cuisine, price, items } = req.body;

    // Verify chef
    const chef = await User.findOne({ _id: req.user.id, role: 'chef' });
    if (!chef) {
      return res.status(403).json({ message: 'Only chefs can create menus' });
    }

    const menu = await Menu.create({
      chef: req.user.id,
      name,
      description,
      type,
      cuisine,
      price,
      items: items || []
    });

    res.status(201).json(menu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all menus for a chef
 * @route   GET /api/menus/chef/:chefId
 * @access  Public
 */
exports.getChefMenus = async (req, res) => {
  try {
    const { chefId } = req.params;
    const { type, cuisine } = req.query;

    const query = { chef: chefId };
    if (type) query.type = type;
    if (cuisine) query.cuisine = cuisine;

    const menus = await Menu.find(query)
      .populate('items')
      .sort('name');

    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get menu by ID
 * @route   GET /api/menus/:id
 * @access  Public
 */
exports.getMenuById = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id)
      .populate('items')
      .populate('chef', 'name chefProfile');

    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    res.status(200).json(menu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update menu
 * @route   PUT /api/menus/:id
 * @access  Private (Chef Only)
 */
exports.updateMenu = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);

    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    // Check ownership
    if (menu.chef.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this menu' });
    }

    const updatedMenu = await Menu.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('items');

    res.status(200).json(updatedMenu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete menu
 * @route   DELETE /api/menus/:id
 * @access  Private (Chef Only)
 */
exports.deleteMenu = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);

    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    // Check ownership
    if (menu.chef.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this menu' });
    }

    // Delete associated menu items
    await MenuItem.deleteMany({ _id: { $in: menu.items } });
    await menu.deleteOne();

    res.status(200).json({ message: 'Menu deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Add item to menu
 * @route   POST /api/menus/:id/items
 * @access  Private (Chef Only)
 */
exports.addMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, ingredients, allergens, image } = req.body;
    const menu = await Menu.findById(req.params.id);

    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    // Check ownership
    if (menu.chef.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to modify this menu' });
    }

    const menuItem = await MenuItem.create({
      menu: menu._id,
      name,
      description,
      price,
      category,
      ingredients,
      allergens,
      image
    });

    menu.items.push(menuItem._id);
    await menu.save();

    res.status(201).json(menuItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update menu item
 * @route   PUT /api/menus/items/:itemId
 * @access  Private (Chef Only)
 */
exports.updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.itemId);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    const menu = await Menu.findById(menuItem.menu);
    
    // Check ownership
    if (menu.chef.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to modify this menu item' });
    }

    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.itemId,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete menu item
 * @route   DELETE /api/menus/items/:itemId
 * @access  Private (Chef Only)
 */
exports.deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.itemId);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    const menu = await Menu.findById(menuItem.menu);
    
    // Check ownership
    if (menu.chef.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this menu item' });
    }

    // Remove item from menu
    menu.items = menu.items.filter(item => item.toString() !== req.params.itemId);
    await menu.save();

    // Delete the item
    await menuItem.deleteOne();

    res.status(200).json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get featured menus
 * @route   GET /api/menus/featured
 * @access  Public
 */
exports.getFeaturedMenus = async (req, res) => {
  try {
    const menus = await Menu.find({ isFeatured: true })
      .populate('items')
      .populate('chef', 'name chefProfile')
      .limit(6);

    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Search menus
 * @route   GET /api/menus/search
 * @access  Public
 */
exports.searchMenus = async (req, res) => {
  try {
    const { query, cuisine, maxPrice, type } = req.query;
    const searchQuery = {};

    if (query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }

    if (cuisine) searchQuery.cuisine = cuisine;
    if (type) searchQuery.type = type;
    if (maxPrice) searchQuery.price = { $lte: parseFloat(maxPrice) };

    const menus = await Menu.find(searchQuery)
      .populate('items')
      .populate('chef', 'name chefProfile')
      .sort('-createdAt');

    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 