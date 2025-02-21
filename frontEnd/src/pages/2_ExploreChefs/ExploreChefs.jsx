import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Layout/Footer';
import api from '../../services/api';

const ExploreChefs = () => {
  const [chefs, setChefs] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/chefs')
      .then(response => setChefs(response.data.chefs))
      .catch(error => console.error('Error fetching chefs:', error));
  }, []);

  const filteredChefs = chefs.filter(chef =>
    chef.name.toLowerCase().includes(search.toLowerCase()) ||
    chef.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-20 max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mt-10">Explore Chefs</h1>
        <div className="flex justify-center my-6">
          <input
            type="text"
            placeholder="Search chefs..."
            className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredChefs.length > 0 ? (
            filteredChefs.map(chef => (
              <div key={chef._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img src={chef.image} alt={chef.name} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold">{chef.name}</h3>
                  <p className="text-gray-600">{chef.specialty}</p>
                  <div className="flex items-center mt-4">
                    <i className="fas fa-star text-[#D4AF37] mr-1"></i>
                    <span>{chef.rating}</span>
                  </div>
                  <Link to={`/chef/${chef._id}`} className="block mt-4 text-[#D4AF37] hover:underline">
                    View Profile
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No chefs found.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ExploreChefs;