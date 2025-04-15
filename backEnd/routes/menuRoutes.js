// routes/menuRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Sample mock menus data for chefs
const mockMenus = {
  // Sample menus for French cuisine chefs (ids 1, 19)
  '1': [
    {
      id: '101',
      name: 'Classic French Tasting Menu',
      description: 'A journey through traditional French cuisine with modern touches',
      price: 95,
      items: [
        { id: '1001', name: 'Amuse-bouche', description: 'Chef\'s seasonal selection' },
        { id: '1002', name: 'French Onion Soup', description: 'With gruyère cheese and toasted baguette' },
        { id: '1003', name: 'Coq au Vin', description: 'Braised chicken with red wine, mushrooms, and pearl onions' },
        { id: '1004', name: 'Tarte Tatin', description: 'Classic upside-down caramelized apple tart with crème fraîche' }
      ]
    },
    {
      id: '102',
      name: 'Parisian Bistro Experience',
      description: 'Casual French dining featuring bistro classics',
      price: 75,
      items: [
        { id: '1005', name: 'Pâté de Campagne', description: 'Country-style pâté with cornichons and Dijon mustard' },
        { id: '1006', name: 'Steak Frites', description: 'Pan-seared steak with hand-cut fries and béarnaise sauce' },
        { id: '1007', name: 'Crème Brûlée', description: 'Vanilla bean custard with caramelized sugar crust' }
      ]
    }
  ],
  '19': [
    {
      id: '103',
      name: 'French Bistro Classics',
      description: 'Traditional bistro fare with seasonal ingredients',
      price: 85,
      items: [
        { id: '1008', name: 'Escargots de Bourgogne', description: 'Snails in garlic-herb butter' },
        { id: '1009', name: 'Cassoulet', description: 'Duck confit, sausage, and white bean stew' },
        { id: '1010', name: 'Mousse au Chocolat', description: 'Dark chocolate mousse with chantilly cream' }
      ]
    }
  ],
  
  // Sample menus for Italian cuisine chef (id 2)
  '2': [
    {
      id: '201',
      name: 'Tuscan Feast',
      description: 'A celebration of Tuscan flavors and traditions',
      price: 85,
      items: [
        { id: '2001', name: 'Antipasto Toscano', description: 'Selection of cured meats, pecorino cheese, and olives' },
        { id: '2002', name: 'Pappardelle al Cinghiale', description: 'Wide ribbon pasta with wild boar ragù' },
        { id: '2003', name: 'Bistecca alla Fiorentina', description: 'Grilled T-bone steak with rosemary and olive oil' },
        { id: '2004', name: 'Cantucci con Vin Santo', description: 'Almond biscotti with sweet dessert wine' }
      ]
    },
    {
      id: '202',
      name: 'Pasta Masterclass',
      description: 'A showcase of handmade pasta varieties',
      price: 70,
      items: [
        { id: '2005', name: 'Burrata con Prosciutto', description: 'Creamy burrata cheese with aged prosciutto' },
        { id: '2006', name: 'Trio of Pasta', description: 'Ravioli, tagliatelle, and tortellini with seasonal sauces' },
        { id: '2007', name: 'Tiramisu', description: 'Classic coffee-soaked ladyfingers with mascarpone cream' }
      ]
    }
  ],
  
  // Sample menus for Spanish cuisine chef (id 3)
  '3': [
    {
      id: '301',
      name: 'Tapas Experience',
      description: 'A selection of traditional Spanish small plates',
      price: 75,
      items: [
        { id: '3001', name: 'Jamón Ibérico', description: 'Acorn-fed Iberian ham with pan con tomate' },
        { id: '3002', name: 'Gambas al Ajillo', description: 'Garlic shrimp with chili and olive oil' },
        { id: '3003', name: 'Patatas Bravas', description: 'Crispy potatoes with spicy tomato sauce and aioli' },
        { id: '3004', name: 'Croquetas de Jamón', description: 'Ham croquettes with béchamel sauce' },
        { id: '3005', name: 'Churros con Chocolate', description: 'Spanish fried dough with thick hot chocolate' }
      ]
    },
    {
      id: '302',
      name: 'Paella Feast',
      description: 'Traditional Spanish rice dishes',
      price: 90,
      items: [
        { id: '3006', name: 'Gazpacho Andaluz', description: 'Chilled tomato soup with vegetable garnish' },
        { id: '3007', name: 'Paella Mixta', description: 'Saffron rice with seafood, chicken, and chorizo' },
        { id: '3008', name: 'Crema Catalana', description: 'Spanish custard with caramelized sugar top' }
      ]
    }
  ],
  
  // Sample menus for Japanese cuisine chef (id 4)
  '4': [
    {
      id: '401',
      name: 'Omakase Experience',
      description: 'Chef\'s selection of premium seasonal ingredients',
      price: 120,
      items: [
        { id: '4001', name: 'Seasonal Sashimi', description: 'Selection of premium raw fish' },
        { id: '4002', name: 'Nigiri Selection', description: 'Assorted hand-pressed sushi' },
        { id: '4003', name: 'Wagyu Beef', description: 'A5 grade Japanese wagyu, briefly seared' },
        { id: '4004', name: 'Dobin Mushi', description: 'Clear seafood broth served in a teapot' },
        { id: '4005', name: 'Yuzu Sorbet', description: 'Refreshing citrus sorbet to cleanse the palate' }
      ]
    },
    {
      id: '402',
      name: 'Kaiseki Ryori',
      description: 'Traditional multi-course Japanese dinner',
      price: 150,
      items: [
        { id: '4006', name: 'Sakizuke', description: 'Amuse-bouche to open the meal' },
        { id: '4007', name: 'Mukozuke', description: 'Seasonal sashimi platter' },
        { id: '4008', name: 'Yakimono', description: 'Grilled fish or meat dish' },
        { id: '4009', name: 'Shiizakana', description: 'Hearty dish, often a hot pot' },
        { id: '4010', name: 'Mizumono', description: 'Seasonal dessert with Japanese elements' }
      ]
    }
  ],
  
  // Providing one sample menu for a few more chefs
  '5': [{ // Indian cuisine
    id: '501',
    name: 'Royal Indian Feast',
    description: 'A luxurious journey through regional Indian cuisines',
    price: 90,
    items: [
      { id: '5001', name: 'Assorted Appetizers', description: 'Selection of samosas, pakoras, and kebabs' },
      { id: '5002', name: 'Butter Chicken', description: 'Tandoori chicken in rich tomato-butter sauce' },
      { id: '5003', name: 'Lamb Biryani', description: 'Fragrant basmati rice with spiced lamb' },
      { id: '5004', name: 'Assorted Breads', description: 'Selection of naan, roti, and paratha' },
      { id: '5005', name: 'Gulab Jamun', description: 'Sweet milk dumplings in rose syrup' }
    ]
  }],
  
  '6': [{ // Mexican cuisine
    id: '601',
    name: 'Mexican Fiesta',
    description: 'Authentic Mexican dishes beyond the typical taco',
    price: 80,
    items: [
      { id: '6001', name: 'Guacamole Tradicional', description: 'Freshly made tableside with traditional ingredients' },
      { id: '6002', name: 'Chiles en Nogada', description: 'Poblano chiles stuffed with picadillo, topped with walnut sauce' },
      { id: '6003', name: 'Mole Poblano', description: 'Complex sauce with chocolate and chiles over chicken' },
      { id: '6004', name: 'Tres Leches Cake', description: 'Sponge cake soaked in three kinds of milk' }
    ]
  }],
  
  '10': [{ // Moroccan cuisine
    id: '1001',
    name: 'Moroccan Royal Feast',
    description: 'Traditional Moroccan dining experience',
    price: 95,
    items: [
      { id: '10001', name: 'Moroccan Mezze', description: 'Selection of salads and dips with fresh bread' },
      { id: '10002', name: 'Lamb Tagine', description: 'Slow-cooked lamb with apricots and almonds' },
      { id: '10003', name: 'Couscous Royale', description: 'Steamed couscous with seven vegetables and meat' },
      { id: '10004', name: 'Moroccan Pastries', description: 'Assortment of honey and nut pastries' }
    ]
  }],
  
  '17': [{ // Vegetarian Indian
    id: '1701',
    name: 'Vegetarian Thali',
    description: 'Complete vegetarian meal with multiple dishes',
    price: 75,
    items: [
      { id: '17001', name: 'Paneer Tikka', description: 'Marinated and grilled cottage cheese' },
      { id: '17002', name: 'Dal Makhani', description: 'Creamy black lentils cooked overnight' },
      { id: '17003', name: 'Vegetable Biryani', description: 'Fragrant rice with seasonal vegetables' },
      { id: '17004', name: 'Mango Kulfi', description: 'Indian ice cream with cardamom and pistachios' }
    ]
  }]
};

/**
 * @route   GET /api/chefs/:chefId/menus
 * @desc    Get menus for a specific chef
 * @access  Public
 */
router.get('/chefs/:chefId/menus', (req, res) => {
  const { chefId } = req.params;
  const menus = mockMenus[chefId] || [];
  
  res.status(200).json({
    menus,
    count: menus.length
  });
});

/**
 * @route   GET /api/menus
 * @desc    Get all menus or menus by chef ID
 * @access  Public
 */
router.get('/', (req, res) => {
  const { chefId } = req.query;
  
  if (chefId) {
    const menus = mockMenus[chefId] || [];
    return res.status(200).json({
      menus,
      count: menus.length
    });
  }
  
  // If no chefId provided, return all menus (flattened)
  const allMenus = Object.values(mockMenus).flat();
  
  res.status(200).json({
    menus: allMenus,
    count: allMenus.length
  });
});

/**
 * @route   GET /api/menus/:id
 * @desc    Get menu by ID
 * @access  Public
 */
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  // Search for the menu in all chef menus
  for (const chefMenus of Object.values(mockMenus)) {
    const menu = chefMenus.find(menu => menu.id === id);
    if (menu) {
      return res.status(200).json({ menu });
    }
  }
  
  res.status(404).json({ message: 'Menu not found' });
});

module.exports = router; 