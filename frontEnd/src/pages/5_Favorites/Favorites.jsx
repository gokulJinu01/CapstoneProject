// src/pages/5_Favorites/Favorites.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Layout/Footer';

const Favorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      setError('Please log in to view your favorites');
      setLoading(false);
      return;
    }
    fetchFavorites();
  }, [user]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Call the API to get favorites
      const response = await userAPI.getFavorites();
      console.log('Favorites response:', response.data);
      
      // Handle different response formats
      if (response.data && response.data.favoriteChefs) {
        setFavorites(response.data.favoriteChefs);
      } else if (response.data && Array.isArray(response.data)) {
        setFavorites(response.data);
      } else if (response.data && Array.isArray(response.data.favorites)) {
        setFavorites(response.data.favorites);
      } else {
        // If no favorites or unexpected format, set empty array
        setFavorites([]);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      const errorMessage = error.response?.status === 401 
        ? 'Please log in to view your favorites'
        : 'Failed to load favorites. Please try again later.';
      setError(errorMessage);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (chefId) => {
    if (!user) {
      setError('Please log in to manage your favorites');
      return;
    }

    try {
      await userAPI.removeFavorite(chefId);
      // Remove from UI immediately for better user experience
      setFavorites(favorites.filter(chef => chef._id !== chefId));
    } catch (error) {
      console.error('Error removing favorite:', error);
      const errorMessage = error.response?.status === 401 
        ? 'Please log in to manage your favorites'
        : 'Failed to remove from favorites. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Favorite Chefs</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading favorites...</p>
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map(chef => (
              <div key={chef._id} className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={chef.image || chef.profilePicture || "https://placehold.co/300x300/e0e0e0/ffffff?text=Chef"} 
                    alt={chef.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900">{chef.name}</h3>
                  <p className="text-gray-600 mb-4">{chef.specialty || chef.cuisines?.join(', ') || 'Private Chef'}</p>
                  <div className="flex justify-between items-center">
                    <Link 
                      to={`/chef/${chef._id}`}
                      className="text-[#D4AF37] hover:text-[#C19B2E] font-medium"
                    >
                      View Profile
                    </Link>
                    <button 
                      onClick={() => handleRemoveFavorite(chef._id)}
                      className="text-red-500 hover:text-red-700"
                      title="Remove from favorites"
                    >
                      <i className="fas fa-heart"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-lg shadow-sm">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
              <i className="far fa-heart text-gray-400 text-xl"></i>
            </div>
            <h3 className="mt-5 text-lg font-medium text-gray-900">No favorites yet</h3>
            <p className="mt-2 text-sm text-gray-500">
              Browse chefs and add them to your favorites to see them here.
            </p>
            <Link to="/explore">
              <button className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#D4AF37] hover:bg-[#C19B2E]">
                Explore Chefs
              </button>
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Favorites;