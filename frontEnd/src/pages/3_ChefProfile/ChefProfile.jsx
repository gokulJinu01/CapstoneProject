import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Layout/Footer';
import api from '../../services/api';

const ChefProfile = () => {
  const { id } = useParams();
  const [chef, setChef] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/chefs/${id}`)
      .then(response => {
        setChef(response.data.chef);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching chef details:', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading chef profile...</p>;
  if (!chef) return <p className="text-center mt-10">Chef not found.</p>;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-20 max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <img src={chef.image} alt={chef.name} className="w-full rounded-lg shadow-lg" />
          </div>
          <div className="md:w-2/3">
            <h1 className="text-4xl font-bold">{chef.name}</h1>
            <p className="mt-2 text-gray-600">{chef.specialty}</p>
            <div className="flex items-center mt-4">
              <i className="fas fa-star text-[#D4AF37] mr-1"></i>
              <span>{chef.rating}</span>
            </div>
            <p className="mt-4">{chef.bio}</p>
            <button className="mt-6 px-6 py-2 bg-[#D4AF37] text-white rounded hover:bg-[#C19B2E]">
              Hire Me
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ChefProfile;