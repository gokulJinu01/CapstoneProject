// controllers/chefController.js
const User = require('../models/User');

// Sample mock data for chefs
const mockChefs = [
      {
        _id: '1',
    name: 'Arjun Kumar',
        email: 'arjun@example.com',
        role: 'Chef',
        chefProfile: {
          specialty: 'French Cuisine',
      experience: '12 years',
          rating: 4.9,
      bio: 'Award-winning chef with Michelin star restaurant experience. Specializes in classical French techniques with modern influences.',
      location: 'New York, NY',
      hourlyRate: 120,
      availability: true,
      featured: true,
      image: 'https://images.unsplash.com/photo-1622021142947-3e6c94da0592?q=80&w=1974&auto=format&fit=crop',
      gallery: ['https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500'],
      specialties: ['French Fine Dining', 'Pastry', 'Wine Pairing']
        }
      },
      {
        _id: '2',
    name: 'Jestin Mathew',
        email: 'jestin@example.com',
        role: 'Chef',
        chefProfile: {
          specialty: 'Italian Cuisine',
          experience: '8 years',
          rating: 4.7,
      bio: 'Passionate about authentic Italian cuisine, trained in Naples and Florence. My handmade pasta will transport you to the streets of Italy.',
      location: 'Chicago, IL',
      hourlyRate: 90,
      availability: true,
      featured: true,
      image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=1978&auto=format&fit=crop',
      gallery: ['https://images.unsplash.com/photo-1579684947550-22e945225d9a?w=500', 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=500'],
      specialties: ['Pasta Making', 'Risotto', 'Italian Desserts']
        }
      },
      {
        _id: '3',
        name: 'Maria Garcia',
        email: 'maria@example.com',
        role: 'Chef',
        chefProfile: {
          specialty: 'Spanish Cuisine',
      experience: '10 years',
      rating: 4.8,
      bio: 'Born and raised in Barcelona, I bring the authentic taste of Spain to your table. From traditional paellas to modern tapas creations.',
      location: 'Miami, FL',
      hourlyRate: 100,
      availability: true,
      featured: true,
      image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?q=80&w=2080&auto=format&fit=crop',
      gallery: ['https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=500', 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500'],
      specialties: ['Paella', 'Tapas', 'Spanish Wines']
    }
  },
  {
    _id: '4',
    name: 'Takashi Yamamoto',
    email: 'takashi@example.com',
    role: 'Chef',
    chefProfile: {
      specialty: 'Japanese Cuisine',
      experience: '15 years',
      rating: 5.0,
      bio: 'Certified sushi master with training in Tokyo. I focus on traditional Kaiseki cuisine and innovative sushi preparations using the freshest ingredients.',
      location: 'San Francisco, CA',
      hourlyRate: 150,
      availability: true,
      featured: true,
      image: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?q=80&w=2070&auto=format&fit=crop',
      gallery: ['https://images.unsplash.com/photo-1553621042-f6e147245754?w=500', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500'],
      specialties: ['Sushi', 'Ramen', 'Kaiseki']
    }
  },
  {
    _id: '5',
    name: 'Priya Patel',
    email: 'priya@example.com',
    role: 'Chef',
    chefProfile: {
      specialty: 'Indian Cuisine',
      experience: '9 years',
      rating: 4.8,
      bio: 'Third-generation chef specializing in authentic regional Indian cuisine. My dishes feature hand-ground spices and traditional cooking methods.',
      location: 'Austin, TX',
      hourlyRate: 95,
      availability: true,
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2070&auto=format&fit=crop',
      gallery: ['https://images.unsplash.com/photo-1585937421612-70a008356c36?w=500', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500'],
      specialties: ['North Indian', 'South Indian', 'Indian Street Food']
    }
  },
  {
    _id: '6',
    name: 'Carlos Rodriguez',
    email: 'carlos@example.com',
    role: 'Chef',
    chefProfile: {
      specialty: 'Mexican Cuisine',
      experience: '11 years',
      rating: 4.7,
      bio: 'Bringing the vibrant flavors of Mexican regional cooking to your home. Specializing in both traditional recipes and contemporary interpretations.',
      location: 'Los Angeles, CA',
      hourlyRate: 110,
      availability: true,
      image: 'https://images.unsplash.com/photo-1581349437898-cebbe9831942?q=80&w=2034&auto=format&fit=crop',
      gallery: ['https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?w=500', 'https://images.unsplash.com/photo-1604467794349-0b74285de7e6?w=500'],
      specialties: ['Mole', 'Tacos', 'Mezcal Pairings']
    }
  },
  {
    _id: '7',
    name: 'Sophie Laurent',
    email: 'sophie@example.com',
    role: 'Chef',
    chefProfile: {
      specialty: 'Pastry & Desserts',
      experience: '9 years',
      rating: 4.9,
      bio: 'Classically trained pastry chef with expertise in French patisserie and modern dessert techniques. Your sweet dreams come true!',
      location: 'Portland, OR',
      hourlyRate: 90,
      availability: true,
      featured: true,
      image: 'https://images.unsplash.com/photo-1607631568010-a87245c0dbd6?q=80&w=1974&auto=format&fit=crop',
      gallery: ['https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500', 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500'],
      specialties: ['French Pastry', 'Wedding Cakes', 'Chocolate Work']
    }
  },
  {
    _id: '8',
    name: 'Ming Li',
    email: 'ming@example.com',
    role: 'Chef',
    chefProfile: {
      specialty: 'Chinese Cuisine',
      experience: '14 years',
      rating: 4.8,
      bio: 'Master of traditional Chinese cooking across multiple regional styles. Expert in dim sum, wok techniques, and tea pairing.',
      location: 'Seattle, WA',
      hourlyRate: 110,
      availability: true,
      image: 'https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?q=80&w=2080&auto=format&fit=crop',
      gallery: ['https://images.unsplash.com/photo-1569058242567-93de6f36f8eb?w=500', 'https://images.unsplash.com/photo-1541696490-8744a5dc0228?w=500'],
      specialties: ['Sichuan', 'Cantonese', 'Dim Sum']
    }
  },
  {
    _id: '9',
    name: 'Dimitri Petrov',
    email: 'dimitri@example.com',
    role: 'Chef',
    chefProfile: {
      specialty: 'Mediterranean Cuisine',
      experience: '8 years',
      rating: 4.6,
      bio: 'Bringing the sunshine of the Mediterranean to your table with fresh, healthy, and vibrant dishes from Greece, Italy, and the Levant.',
      location: 'Boston, MA',
      hourlyRate: 100,
      availability: true,
      image: 'https://images.unsplash.com/photo-1650825556126-28c92b5fd6e4?q=80&w=1974&auto=format&fit=crop',
      gallery: ['https://images.unsplash.com/photo-1503764654157-72d979d9af2f?w=500', 'https://images.unsplash.com/photo-1544250634-1f76e88c390d?w=500'],
      specialties: ['Greek', 'Lebanese', 'Seafood']
    }
  },
  {
    _id: '10',
    name: 'Fatima Al-Fasi',
    email: 'fatima@example.com',
    role: 'Chef',
    chefProfile: {
      specialty: 'Moroccan Cuisine',
      experience: '10 years',
      rating: 4.9,
      bio: 'Expert in authentic Moroccan tagines, couscous, and pastries. I create immersive dining experiences with traditional serving methods and settings.',
      location: 'Washington, DC',
      hourlyRate: 115,
      availability: true,
      image: 'https://images.unsplash.com/photo-1589397992262-449476a2d785?q=80&w=2070&auto=format&fit=crop',
      gallery: ['https://images.unsplash.com/photo-1541844053589-346841d0b34c?w=500', 'https://images.unsplash.com/photo-1620626576561-d4c18b32d11f?w=500'],
      specialties: ['Tagines', 'Couscous', 'Moroccan Pastry']
    }
  },
  {
    _id: '11',
    name: 'Kenji Tanaka',
    email: 'kenji@example.com',
    role: 'Chef',
    chefProfile: {
      specialty: 'Fusion Asian',
      experience: '7 years',
      rating: 4.7,
      bio: 'Creating innovative fusion cuisine blending Japanese techniques with global influences. Modern presentations with respect for traditional methods.',
      location: 'Denver, CO',
      hourlyRate: 120,
      availability: true,
      image: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?q=80&w=1974&auto=format&fit=crop',
      gallery: ['https://images.unsplash.com/photo-1614508299506-d7256eea767e?w=500', 'https://images.unsplash.com/photo-1615361200141-f45961bc0d4c?w=500'],
      specialties: ['Asian Fusion', 'Ramen', 'Izakaya Style']
    }
  },
  {
    _id: '12',
    name: 'Olivia Johnson',
    email: 'olivia@example.com',
    role: 'Chef',
    chefProfile: {
      specialty: 'Farm-to-Table',
      experience: '6 years',
      rating: 4.8,
      bio: 'Passionate about seasonal, locally-sourced ingredients. My menus change with the seasons and highlight the best local producers and artisans.',
      location: 'Nashville, TN',
      hourlyRate: 105,
      availability: true,
      image: 'https://images.unsplash.com/photo-1604174953941-3d799e8a9d7e?q=80&w=1974&auto=format&fit=crop',
      gallery: ['https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=500', 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500'],
      specialties: ['Seasonal Cooking', 'Vegetable Focus', 'Charcuterie']
    }
  },
  {
    _id: '13',
    name: 'Gabriel Fernandez',
    email: 'gabriel@example.com',
    role: 'Chef',
    chefProfile: {
      specialty: 'Latin American',
      experience: '9 years',
      rating: 4.6,
      bio: 'From Argentina to Mexico, I bring the diverse flavors of Latin America to your table. Expert in grilling techniques and vibrant ceviches.',
      location: 'Atlanta, GA',
      hourlyRate: 95,
      availability: true,
      image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=1978&auto=format&fit=crop',
      gallery: ['https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?w=500', 'https://images.unsplash.com/photo-1593642634524-b40b5baae6bb?w=500'],
      specialties: ['Argentinian BBQ', 'Peruvian', 'Ceviche']
    }
  },
  {
    _id: '14',
    name: 'Amara Okafor',
    email: 'amara@example.com',
    role: 'Chef',
    chefProfile: {
      specialty: 'West African',
      experience: '8 years',
      rating: 4.9,
      bio: 'Bringing the rich culinary heritage of West Africa to modern dining. Traditional recipes with contemporary presentation and local ingredients.',
      location: 'Philadelphia, PA',
      hourlyRate: 100,
      availability: true,
      featured: true,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop',
      gallery: ['https://images.unsplash.com/photo-1583916897251-35a7300e9941?w=500', 'https://images.unsplash.com/photo-1612102741109-62c2c98a0649?w=500'],
      specialties: ['Nigerian', 'Ghanaian', 'Senegalese']
    }
  },
  {
    _id: '15',
    name: 'Thomas Schmidt',
    email: 'thomas@example.com',
    role: 'Chef',
    chefProfile: {
      specialty: 'German & Austrian',
      experience: '11 years',
      rating: 4.7,
      bio: 'Master of traditional German and Austrian cuisine with modern twists. From hearty classics to refined alpine dining experiences.',
      location: 'Milwaukee, WI',
      hourlyRate: 95,
      availability: true,
      image: 'https://images.unsplash.com/photo-1530648672449-81f6c723e2f1?q=80&w=1974&auto=format&fit=crop',
      gallery: ['https://images.unsplash.com/photo-1551421848-0e8984aad3f1?w=500', 'https://images.unsplash.com/photo-1607197109266-770560468b45?w=500'],
      specialties: ['Schnitzel', 'Sausages', 'Alpine Cuisine']
    }
  },
  {
    _id: '16',
    name: 'Leila Ahmadi',
    email: 'leila@example.com',
    role: 'Chef',
    chefProfile: {
      specialty: 'Persian Cuisine',
      experience: '9 years',
      rating: 4.8,
      bio: 'Showcasing the elegant flavors of Persian cuisine with its aromatic herbs, tender meats, and jeweled rice dishes. A true feast for the senses.',
      location: 'Houston, TX',
      hourlyRate: 110,
      availability: true,
      image: 'https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=2071&auto=format&fit=crop',
      gallery: ['https://images.unsplash.com/photo-1626203050470-4b15cd5a25a5?w=500', 'https://images.unsplash.com/photo-1576444356170-66073046b1bc?w=500'],
      specialties: ['Persian Rice', 'Kebabs', 'Traditional Stews']
    }
  },
  {
    _id: '17',
    name: 'Raj Sharma',
    email: 'raj@example.com',
    role: 'Chef',
    chefProfile: {
      specialty: 'Vegetarian Indian',
      experience: '10 years',
      rating: 4.9,
      bio: 'Specializing in vegetarian and vegan interpretations of classic Indian dishes. Creating depth of flavor and satisfaction without meat.',
      location: 'San Diego, CA',
      hourlyRate: 95,
      availability: true,
      image: 'https://images.unsplash.com/photo-1578925518470-4def7a0f08bb?q=80&w=1931&auto=format&fit=crop',
      gallery: ['https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500', 'https://images.unsplash.com/photo-1596797038530-2c107aa4606c?w=500'],
      specialties: ['Vegetarian', 'Vegan', 'Ayurvedic Cooking']
    }
  },
  {
    _id: '18',
    name: 'Elena Petrov',
    email: 'elena@example.com',
    role: 'Chef',
    chefProfile: {
      specialty: 'Eastern European',
      experience: '8 years',
      rating: 4.6,
      bio: 'From hearty Russian soups to delicate Polish pierogi, I bring the comforting flavors of Eastern Europe to your table with authentic techniques.',
      location: 'Minneapolis, MN',
      hourlyRate: 90,
      availability: true,
      image: 'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?q=80&w=2080&auto=format&fit=crop',
      gallery: ['https://images.unsplash.com/photo-1615937722923-67f6deaf2cc9?w=500', 'https://images.unsplash.com/photo-1551135049-8a33b5883817?w=500'],
      specialties: ['Russian', 'Polish', 'Ukrainian']
    }
  },
  {
    _id: '19',
    name: 'Sebastien Dubois',
    email: 'sebastien@example.com',
    role: 'Chef',
    chefProfile: {
      specialty: 'French Bistro',
      experience: '13 years',
          rating: 4.8,
      bio: 'Bringing the authentic experience of a Parisian bistro to your home. Classic French comfort food with impeccable technique and warmth.',
      location: 'New Orleans, LA',
      hourlyRate: 115,
      availability: true,
      featured: true,
      image: 'https://images.unsplash.com/photo-1595475207225-428b62bda831?q=80&w=2000&auto=format&fit=crop',
      gallery: ['https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=500', 'https://images.unsplash.com/photo-1600891964599-f61f4c003e1c?w=500'],
      specialties: ['Bistro Classics', 'Charcuterie', 'Terrines']
    }
  },
  {
    _id: '20',
    name: 'Aiko Nakamura',
    email: 'aiko@example.com',
    role: 'Chef',
    chefProfile: {
      specialty: 'Vegan Japanese',
      experience: '7 years',
      rating: 4.7,
      bio: 'Innovative plant-based interpretations of Japanese classics. Specialized in shojin ryori (Buddhist temple cuisine) and modern vegan sushi.',
      location: 'Portland, OR',
      hourlyRate: 105,
      availability: true,
      image: 'https://images.unsplash.com/photo-1619855544858-e8e275c3b31a?q=80&w=1974&auto=format&fit=crop',
      gallery: ['https://images.unsplash.com/photo-1547592180-85f173990554?w=500', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500'],
      specialties: ['Vegan Sushi', 'Temple Cuisine', 'Plant-based Japanese']
    }
  }
];

/**
 * GET /api/chefs
 * Retrieves a list of all users with role 'Chef'
 */
exports.getAllChefs = async (req, res) => {
  try {
    // Get filters from query params
    const { search, cuisine, rating, price } = req.query;
    console.log('Backend received search params:', { search, cuisine, rating, price });
    
    // Filter the mock data based on search criteria
    let filteredChefs = [...mockChefs];
    
    // Filter by search term (name, specialty, or location)
    if (search) {
      console.log('Filtering by search term:', search);
      const searchLower = search.toLowerCase();
      filteredChefs = filteredChefs.filter(chef => 
        chef.name.toLowerCase().includes(searchLower) || 
        (chef.chefProfile?.specialty && chef.chefProfile.specialty.toLowerCase().includes(searchLower)) || 
        (chef.chefProfile?.location && chef.chefProfile.location.toLowerCase().includes(searchLower))
      );
      console.log(`Found ${filteredChefs.length} chefs after search filtering`);
    }
    
    // Filter by cuisine
    if (cuisine && cuisine !== '') {
      console.log('Filtering by cuisine:', cuisine);
      const cuisineLower = cuisine.toLowerCase();
      filteredChefs = filteredChefs.filter(chef => {
        // Check in specialty
        if (chef.chefProfile?.specialty && chef.chefProfile.specialty.toLowerCase().includes(cuisineLower)) {
          return true;
        }
        
        // Check in specialties array
        if (chef.chefProfile?.specialties && chef.chefProfile.specialties.length > 0) {
          return chef.chefProfile.specialties.some(spec => 
            spec.toLowerCase().includes(cuisineLower)
          );
        }
        
        return false;
      });
      console.log(`Found ${filteredChefs.length} chefs after cuisine filtering`);
    }
    
    // Filter by rating
    if (rating && rating !== '') {
      console.log('Filtering by rating:', rating);
      const ratingNum = parseFloat(rating);
      filteredChefs = filteredChefs.filter(chef => 
        chef.chefProfile?.rating && chef.chefProfile.rating >= ratingNum
      );
      console.log(`Found ${filteredChefs.length} chefs after rating filtering`);
    }
    
    // Filter by price range
    if (price && price !== '') {
      console.log('Filtering by price range:', price);
      let minPrice = 0;
      let maxPrice = 1000;
      
      switch (price) {
        case 'budget':
          maxPrice = 90;
          break;
        case 'moderate':
          minPrice = 91;
          maxPrice = 110;
          break;
        case 'premium':
          minPrice = 111;
          maxPrice = 130;
          break;
        case 'luxury':
          minPrice = 131;
          break;
      }
      
      filteredChefs = filteredChefs.filter(chef =>
        chef.chefProfile?.hourlyRate && 
        chef.chefProfile.hourlyRate >= minPrice && 
        chef.chefProfile.hourlyRate <= maxPrice
      );
      console.log(`Found ${filteredChefs.length} chefs after price filtering`);
    }
    
    // Return the filtered data
    console.log(`Returning final list of ${filteredChefs.length} chefs`);
    res.status(200).json({ 
      chefs: filteredChefs,
      currentPage: 1,
      totalPages: 1,
      totalChefs: filteredChefs.length
    });
  } catch (error) {
    console.error('Error in getAllChefs:', error);
    res.status(500).json({ error: error.message });
  }
};

// Export mock data for use in other controllers
exports.mockChefs = mockChefs;

/**
 * GET /api/chefs/:id
 * Retrieves a single chef by their User ID
 */
exports.getChefById = async (req, res) => {
  const { id } = req.params;
  try {
    // For string IDs, first try mock data
    const mockChef = mockChefs.find(chef => chef._id === id);
    if (mockChef) {
      return res.status(200).json({ chef: mockChef });
    }

    // If not found in mock data, try database
  try {
    const chef = await User.findOne({ _id: id, role: 'Chef' })
      .select('-password')
      .lean();
    if (!chef) {
      return res.status(404).json({ message: 'Chef not found' });
    }
    res.status(200).json({ chef });
    } catch (err) {
      // If MongoDB ObjectId validation fails, return not found
      return res.status(404).json({ message: 'Chef not found' });
    }
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
    // Mock response for demo purposes
    if (id === '1' || id === '2' || id === '3') {
      const mockChef = mockChefs.find(chef => chef._id === id);
      
      return res.status(200).json({
        message: 'Chef profile updated successfully',
        chef: {
          ...mockChef,
          ...req.body
        }
      });
    }

    // Actual database update for MongoDB IDs
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
    } catch (err) {
      return res.status(404).json({ message: 'Chef not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * DELETE /api/chefs/:id
 * Deletes a chef's profile
 */
exports.deleteChefProfile = async (req, res) => {
  const { id } = req.params;
  try {
    // Mock response for demo purposes
    if (id === '1' || id === '2' || id === '3') {
      return res.status(200).json({ message: 'Chef profile deleted successfully' });
    }

    // Actual database delete for MongoDB IDs
  try {
    const chef = await User.findOneAndDelete({ _id: id, role: 'Chef' });
    if (!chef) {
      return res.status(404).json({ message: 'Chef not found' });
    }
    res.status(200).json({ message: 'Chef profile deleted successfully' });
    } catch (err) {
      return res.status(404).json({ message: 'Chef not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};