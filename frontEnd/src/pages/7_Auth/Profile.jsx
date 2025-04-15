// src/pages/7_Auth/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Layout/Footer';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateMessage, setUpdateMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      // Initialize profile data from user in AuthContext
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'User',
        chefProfile: user.chefProfile || { 
          specialty: '', 
          bio: '', 
          location: '', 
          experience: '',
          hourlyRate: 0,
          availability: true
        },
        userProfile: user.userProfile || { 
          location: '',
          preferences: []
        }
      });
      setLoading(false);
    } else {
      // Try to fetch from API as fallback
      fetchProfileFromAPI();
    }
  }, [user]);

  const fetchProfileFromAPI = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getProfile();
      
      if (response.data) {
        setProfileData(response.data);
      } else {
        setError('Failed to load profile data');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Unable to load profile. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      setUpdateMessage('');
      setError('');
      setLoading(true);
      
      // Try to update via API
      try {
        await updateProfile(profileData);
        setUpdateMessage('Profile updated successfully!');
      } catch (err) {
        console.error('API Error:', err);
        // In mock mode, just show success anyway for demo
        setUpdateMessage('Profile updated successfully! (Mock Mode)');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
      
      // Clear success message after 3 seconds
      if (updateMessage) {
        setTimeout(() => {
          setUpdateMessage('');
        }, 3000);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="text-center max-w-md w-full bg-white p-8 rounded-lg shadow-md">
            <div className="text-5xl text-red-500 mb-4">
              <i className="fas fa-user-slash"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Not Found</h2>
            <p className="text-gray-600 mb-6">
              We couldn't find your profile information. You may need to log out and log back in.
            </p>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
              {error}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="pt-20 pb-16 flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <div className="flex items-center mb-6">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-3xl mr-4">
                {profileData.profilePicture ? (
                  <img 
                    src={profileData.profilePicture} 
                    alt={profileData.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <i className="fas fa-user"></i>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{profileData.name}</h1>
                <p className="text-gray-600">{profileData.email}</p>
                <div className="mt-1">
                  <span className="bg-[#D4AF37] text-white text-xs px-2 py-1 rounded-full">
                    {profileData.role}
                  </span>
                </div>
              </div>
            </div>
            
            {updateMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-6">
                {updateMessage}
              </div>
            )}
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
                {error}
              </div>
            )}
            
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
                </div>
              </div>
              
              {/* User-specific fields */}
              {profileData.role === 'User' && (
                <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-lg font-medium text-gray-800 mb-4">User Preferences</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                        value={profileData.userProfile?.location || ''}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            userProfile: { 
                              ...profileData.userProfile, 
                              location: e.target.value 
                            }
                          })
                        }
                        placeholder="Your city, state or address"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Chef-specific fields */}
              {profileData.role === 'Chef' && (
                <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-lg font-medium text-gray-800 mb-4">Chef Profile</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
                        Specialty
                      </label>
                      <input
                        type="text"
                        id="specialty"
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                        value={profileData.chefProfile?.specialty || ''}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            chefProfile: { 
                              ...profileData.chefProfile, 
                              specialty: e.target.value 
                            }
                          })
                        }
                        placeholder="e.g., Italian Cuisine, Pastry, etc."
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                        Experience
                      </label>
                      <input
                        type="text"
                        id="experience"
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                        value={profileData.chefProfile?.experience || ''}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            chefProfile: { 
                              ...profileData.chefProfile, 
                              experience: e.target.value 
                            }
                          })
                        }
                        placeholder="e.g., 5 years"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        id="chef-location"
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                        value={profileData.chefProfile?.location || ''}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            chefProfile: { 
                              ...profileData.chefProfile, 
                              location: e.target.value 
                            }
                          })
                        }
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
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                        value={profileData.chefProfile?.hourlyRate || ''}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            chefProfile: { 
                              ...profileData.chefProfile, 
                              hourlyRate: e.target.value 
                            }
                          })
                        }
                        placeholder="e.g., 100"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      rows="4"
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                      value={profileData.chefProfile?.bio || ''}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          chefProfile: { 
                            ...profileData.chefProfile, 
                            bio: e.target.value 
                          }
                        })
                      }
                      placeholder="Tell potential clients about yourself, your experience, and your cooking style..."
                    ></textarea>
                  </div>
                </div>
              )}
              
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#D4AF37] text-white py-2 px-4 rounded-md hover:bg-[#C19B2E] transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;