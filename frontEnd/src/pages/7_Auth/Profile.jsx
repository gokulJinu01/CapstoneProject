import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Layout/Footer';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const Profile = () => {
  const { token, user, setUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateMessage, setUpdateMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setProfile(response.data.user);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching profile:', error);
        setLoading(false);
      });
  }, [token]);

  const handleUpdate = (e) => {
    e.preventDefault();
    api.put('/auth/profile', profile, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setProfile(response.data.user);
        setUser(response.data.user);
        setUpdateMessage('Profile updated successfully.');
      })
      .catch(error => {
        console.error('Error updating profile:', error);
        setError('Profile update failed.');
      });
  };

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;
  if (!profile) return <p className="text-center mt-10">Profile not found.</p>;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-20 max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mt-10">My Profile</h1>
        {updateMessage && <p className="text-center text-green-500 mt-4">{updateMessage}</p>}
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}
        <form onSubmit={handleUpdate} className="mt-6 space-y-4">
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </div>
          {profile.role === 'User' && profile.userProfile && (
            <div>
              <label className="block text-gray-700">Location</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                value={profile.userProfile.location || ''}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    userProfile: { ...profile.userProfile, location: e.target.value }
                  })
                }
              />
            </div>
          )}
          {profile.role === 'Chef' && profile.chefProfile && (
            <>
              <div>
                <label className="block text-gray-700">Specialty</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  value={profile.chefProfile.specialty || ''}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      chefProfile: { ...profile.chefProfile, specialty: e.target.value }
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-gray-700">Bio</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  value={profile.chefProfile.bio || ''}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      chefProfile: { ...profile.chefProfile, bio: e.target.value }
                    })
                  }
                ></textarea>
              </div>
            </>
          )}
          <button
            type="submit"
            className="w-full bg-[#D4AF37] text-white py-2 rounded hover:bg-[#C19B2E] transition-colors"
          >
            Save Changes
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;