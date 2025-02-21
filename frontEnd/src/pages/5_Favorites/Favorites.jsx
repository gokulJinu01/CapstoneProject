import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Layout/Footer';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/favorites')
      .then(response => {
        setFavorites(response.data.favoriteChefs);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching favorites:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-20 max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mt-10">My Favorite Chefs</h1>
        {loading ? (
          <p className="text-center mt-4">Loading favorites...</p>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {favorites.map(chef => (
              <div key={chef._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img src={chef.image} alt={chef.name} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold">{chef.name}</h3>
                  <p className="text-gray-600">{chef.specialty}</p>
                  <Link to={`/chef/${chef._id}`} className="block mt-2 text-[#D4AF37] hover:underline">
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center mt-4">No favorites found.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Favorites;