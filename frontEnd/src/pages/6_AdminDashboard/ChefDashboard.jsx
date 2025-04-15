import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userAPI, bookingAPI } from '../../services/api';
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Layout/Footer';

const ChefDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [chefProfile, setChefProfile] = useState({
    specialty: '',
    bio: '',
    location: '',
    experience: '',
    hourlyRate: 100,
    availability: false,
    cuisines: []
  });
  const [bookings, setBookings] = useState([]);
  const { updateProfile } = useAuth();
  const navigate = useNavigate();

  const cuisineOptions = [
    'Italian', 'French', 'Japanese', 'Chinese', 'Indian', 
    'Mexican', 'Mediterranean', 'American', 'Thai', 'Spanish',
    'Greek', 'Middle Eastern', 'Korean', 'Vietnamese'
  ];

  useEffect(() => {
    if (!user || user.role !== 'Chef') {
      navigate('/');
      return;
    }

    fetchChefData();
  }, [user, navigate]);

  const fetchChefData = async () => {
    setLoading(true);
    setError('');
    try {
      // Always fetch the latest profile data
      const profileResponse = await userAPI.getProfile();
      if (profileResponse.data) {
        const profileData = profileResponse.data.chefProfile || {};
        setChefProfile(prevProfile => ({
          ...prevProfile,
          ...profileData,
          cuisines: profileData.cuisines || [],
          hourlyRate: profileData.hourlyRate || 100,
          availability: profileData.availability || false
        }));
      }
      
      // Fetch chef bookings
      const bookingsResponse = await bookingAPI.getChefBookings({});
      setBookings(bookingsResponse.data || []);
    } catch (err) {
      console.error("Error fetching chef data:", err);
      setError("Failed to load your chef data. Please refresh the page to try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Update the chef profile
      await updateProfile({
        chefProfile: chefProfile
      });
      
      setSuccess('Profile updated successfully! You are now visible to customers.');
      
      // Automatically switch to bookings tab if chef just went online
      if (chefProfile.availability) {
        setTimeout(() => {
          setActiveTab('bookings');
        }, 1500);
      }
    } catch (err) {
      console.error("Failed to update chef profile:", err);
      setError("Failed to update your profile. Please try again.");
    } finally {
      setSaving(false);

      // Clear success message after 3 seconds
      if (success) {
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      }
    }
  };

  const handleAvailabilityToggle = () => {
    setChefProfile({
      ...chefProfile,
      availability: !chefProfile.availability
    });
  };

  const handleCuisineToggle = (cuisine) => {
    const updatedCuisines = [...(chefProfile.cuisines || [])];
    
    if (updatedCuisines.includes(cuisine)) {
      // Remove cuisine if already selected
      const index = updatedCuisines.indexOf(cuisine);
      updatedCuisines.splice(index, 1);
    } else {
      // Add cuisine if not already selected
      updatedCuisines.push(cuisine);
    }
    
    setChefProfile({
      ...chefProfile,
      cuisines: updatedCuisines
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Chef Dashboard</h1>
            <div className="flex space-x-4">
              <span className={`px-4 py-2 rounded-md cursor-pointer font-medium ${chefProfile.availability 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'}`}
              >
                Status: {chefProfile.availability ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              {success}
            </div>
          )}
          
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-[#D4AF37] text-[#D4AF37]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Chef Profile
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'bookings'
                    ? 'border-[#D4AF37] text-[#D4AF37]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Bookings
              </button>
              <button
                onClick={() => setActiveTab('menus')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'menus'
                    ? 'border-[#D4AF37] text-[#D4AF37]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Menus
              </button>
            </nav>
          </div>
          
          {activeTab === 'profile' && (
            <div>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg mb-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Chef Availability</h3>
                    <p className="text-sm text-gray-500">
                      Toggle your availability to accept new bookings
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <button
                      type="button"
                      onClick={handleAvailabilityToggle}
                      className={`px-4 py-2 rounded-md text-white font-medium ${
                        chefProfile.availability
                          ? 'bg-red-600 hover:bg-red-700'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {chefProfile.availability ? 'Go Offline' : 'Go Online'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
                      Specialty
                    </label>
                    <input
                      type="text"
                      id="specialty"
                      value={chefProfile.specialty || ''}
                      onChange={(e) => setChefProfile({ ...chefProfile, specialty: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                      placeholder="e.g., Italian Cuisine, Pastry Chef"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                      Experience
                    </label>
                    <input
                      type="text"
                      id="experience"
                      value={chefProfile.experience || ''}
                      onChange={(e) => setChefProfile({ ...chefProfile, experience: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                      placeholder="e.g., 5 years, Michelin-star restaurant"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      value={chefProfile.location || ''}
                      onChange={(e) => setChefProfile({ ...chefProfile, location: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                      placeholder="e.g., New York, NY"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-1">
                      Hourly Rate (USD)
                    </label>
                    <input
                      type="number"
                      id="hourlyRate"
                      value={chefProfile.hourlyRate || ''}
                      onChange={(e) => setChefProfile({ ...chefProfile, hourlyRate: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                      placeholder="e.g., 100"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cuisines
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {cuisineOptions.map((cuisine) => (
                      <button
                        key={cuisine}
                        type="button"
                        onClick={() => handleCuisineToggle(cuisine)}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          chefProfile.cuisines?.includes(cuisine)
                            ? 'bg-[#D4AF37] text-white'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                      >
                        {cuisine}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    rows="4"
                    value={chefProfile.bio || ''}
                    onChange={(e) => setChefProfile({ ...chefProfile, bio: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                    placeholder="Tell clients about yourself, your experience, and your cooking style..."
                  ></textarea>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-[#D4AF37] text-white py-2 px-6 rounded-md hover:bg-[#C19B2E] transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {activeTab === 'bookings' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">My Bookings</h2>
              
              {bookings.length === 0 ? (
                <div className="bg-gray-50 p-6 text-center rounded-lg">
                  <p className="text-gray-500">
                    You don't have any bookings yet. Make sure your profile is complete and you're set to "Online".
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookings.map((booking) => (
                        <tr key={booking._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.user?.name || 'Client'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {new Date(booking.date).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.startTime} - {booking.endTime}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {booking.location}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                                booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                booking.status === 'Completed' ? 'bg-blue-100 text-blue-800' : 
                                'bg-red-100 text-red-800'}`}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-[#D4AF37] hover:text-[#C19B2E] mr-3">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'menus' && (
            <div className="bg-gray-50 p-6 text-center rounded-lg">
              <p className="text-gray-500 mb-4">
                This feature is coming soon. You'll be able to create and manage your menus here.
              </p>
              <button 
                className="mt-2 px-4 py-2 bg-[#D4AF37] text-white rounded-md hover:bg-[#C19B2E]"
                onClick={() => setActiveTab('profile')}
              >
                Return to Profile
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ChefDashboard; 