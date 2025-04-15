// src/pages/2_ExploreChefs/ExploreChefs.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Layout/Footer';

const ExploreChefs = () => {
  const { user } = useAuth();
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get the search query from the URL if it exists
  const queryParams = new URLSearchParams(location.search);
  const searchQueryParam = queryParams.get('search') || '';

  const [filters, setFilters] = useState({
    cuisine: queryParams.get('cuisine') || '',
    rating: queryParams.get('rating') || '',
    price: queryParams.get('price') || '',
    search: searchQueryParam
  });

  const cuisineOptions = [
    { value: '', label: 'All Cuisines' },
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

  useEffect(() => {
    fetchChefs();
  }, [filters.cuisine, filters.rating, filters.price]);

  const fetchChefs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Create a copy of filters for the API call
      const apiFilters = {...filters};
      
      // If search is not being triggered by submit button, don't include it
      if (!filters.searchSubmitted && apiFilters.search === '') {
        delete apiFilters.search;
      }
      
      const response = await userAPI.getChefs(apiFilters);
      setChefs(response.data.chefs || []);
    } catch (error) {
      console.error('Error fetching chefs:', error);
      setError('Failed to load chefs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      searchSubmitted: name === 'search' ? false : prev.searchSubmitted
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Set searchSubmitted flag to true
    setFilters(prev => ({
      ...prev,
      searchSubmitted: true
    }));
    
    fetchChefs();

    // Update URL with search query without page reload
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.cuisine) params.set('cuisine', filters.cuisine);
    if (filters.rating) params.set('rating', filters.rating);
    if (filters.price) params.set('price', filters.price);
    
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.pushState({}, '', newUrl);
  };

  const clearFilters = () => {
    setFilters({
      cuisine: '',
      rating: '',
      price: '',
      search: '',
      searchSubmitted: false
    });
    // Clear URL search params
    navigate('/explore');
  };

  // Function to get price range text
  const getPriceRangeText = (hourlyRate) => {
    if (!hourlyRate) return 'Custom Pricing';
    if (hourlyRate <= 90) return `$${hourlyRate}/hr (Budget)`;
    if (hourlyRate <= 110) return `$${hourlyRate}/hr (Moderate)`;
    if (hourlyRate <= 130) return `$${hourlyRate}/hr (Premium)`;
    return `$${hourlyRate}/hr (Luxury)`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <div className="pt-24 pb-16 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Explore Chefs</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover professional chefs from around the world specializing in various cuisines for your next dining experience.
            </p>
          </div>
          
          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-grow">
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                    Search
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fas fa-search text-gray-400"></i>
                    </div>
                    <input
                      type="text"
                      name="search"
                      id="search"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                      placeholder="Search by name, cuisine, or location..."
                      value={filters.search}
                      onChange={handleFilterChange}
                    />
                  </div>
                </div>
                
                {/* Cuisine Filter */}
                <div className="md:w-1/4">
                  <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700 mb-1">
                    Cuisine
                  </label>
                  <select
                    id="cuisine"
                    name="cuisine"
                    value={filters.cuisine}
                    onChange={handleFilterChange}
                    className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                  >
                    {cuisineOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Rating Filter */}
                <div className="md:w-1/4">
                  <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                    Rating
                  </label>
                  <select
                    id="rating"
                    name="rating"
                    value={filters.rating}
                    onChange={handleFilterChange}
                    className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                  >
                    <option value="">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4.8">4.8+ Stars</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4">4+ Stars</option>
                  </select>
                </div>
                
                {/* Price Filter */}
                <div className="md:w-1/4">
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price Range
                  </label>
                  <select
                    id="price"
                    name="price"
                    value={filters.price}
                    onChange={handleFilterChange}
                    className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                  >
                    <option value="">All Prices</option>
                    <option value="budget">$ - Budget (Under $90/hr)</option>
                    <option value="moderate">$$ - Moderate ($90-$110/hr)</option>
                    <option value="premium">$$$ - Premium ($110-$130/hr)</option>
                    <option value="luxury">$$$$ - Luxury (Over $130/hr)</option>
                  </select>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37]"
                >
                  <i className="fas fa-times mr-2"></i>
                  Clear Filters
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#D4AF37] hover:bg-[#C19B2E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37]"
                >
                  <i className="fas fa-search mr-2"></i>
                  Search
                </button>
              </div>
            </form>
          </div>
          
          {/* Results */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
              <p>{error}</p>
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <i className="fas fa-spinner fa-spin text-3xl text-[#D4AF37] mb-4"></i>
                <p className="text-gray-600">Loading chefs...</p>
              </div>
            </div>
          ) : chefs.length > 0 ? (
            <div>
              <p className="text-gray-600 mb-4">Found {chefs.length} chef{chefs.length !== 1 ? 's' : ''}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {chefs.map((chef) => (
                  <div key={chef._id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg hover:translate-y-[-4px]">
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={chef.chefProfile?.image || "https://placehold.co/600x400/e0e0e0/ffffff?text=Chef+Profile"}
                        alt={chef.name} 
                        className="w-full h-full object-cover object-center"
                      />
                      {chef.chefProfile?.featured && (
                        <div className="absolute top-0 right-0 bg-[#D4AF37] text-white px-3 py-1 text-xs font-bold">
                          Featured
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h2 className="text-xl font-semibold text-gray-800">{chef.name}</h2>
                        <div className="flex items-center">
                          <i className="fas fa-star text-[#D4AF37] mr-1"></i>
                          <span>{chef.chefProfile?.rating || '4.5'}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-2">
                        <i className="fas fa-utensils text-[#D4AF37] mr-2"></i>
                        {chef.chefProfile?.specialty || 'Various Cuisines'}
                      </p>
                      
                      {chef.chefProfile?.specialties && chef.chefProfile.specialties.length > 0 && (
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-1">
                            {chef.chefProfile.specialties.slice(0, 3).map((specialty, index) => (
                              <span 
                                key={index} 
                                className="inline-block bg-gray-100 text-gray-700 rounded-full px-2 py-1 text-xs"
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center mb-3">
                        <i className="fas fa-map-marker-alt text-[#D4AF37] mr-2"></i>
                        <span className="text-gray-600">{chef.chefProfile?.location || 'Available in your area'}</span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10 overflow-hidden">
                        {chef.chefProfile?.bio || "Professional chef offering culinary services."}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-[#D4AF37] font-medium">
                          {chef.chefProfile?.hourlyRate ? getPriceRangeText(chef.chefProfile.hourlyRate) : 'Custom Pricing'}
                        </div>
                        {chef.chefProfile?.availability ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Unavailable
                          </span>
                        )}
                      </div>
                      
                      <div className="flex justify-between space-x-3 mt-4">
                        <Link 
                          to={`/chef/${chef._id}`} 
                          className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#D4AF37] hover:bg-[#C19B2E] focus:outline-none"
                        >
                          View Profile
                        </Link>
                        <Link 
                          to={`/chef/${chef._id}/book`} 
                          className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                <i className="fas fa-search text-gray-400"></i>
              </div>
              <h3 className="mt-5 text-lg font-medium text-gray-900">No chefs found</h3>
              <p className="mt-2 text-sm text-gray-500">
                We couldn't find any chefs matching your search criteria. Try adjusting your filters or search terms.
              </p>
              <div className="mt-6">
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#D4AF37] hover:bg-[#C19B2E] focus:outline-none"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ExploreChefs;