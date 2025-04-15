// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in when component mounts
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // Validate token by making a request to get current user
          try {
            await authAPI.validateToken();
          } catch (err) {
            // If token validation fails, log out
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
              logout();
            }
          }
        } catch (err) {
          console.error('Error parsing stored user:', err);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Attempting login with credentials:', credentials);
      console.log('API URL:', process.env.REACT_APP_API_URL || 'http://localhost:5001/api');
      
      const response = await authAPI.login(credentials);
      console.log('Login response:', response);
      console.log('Login response data:', response.data);
      
      const { token, ...userData } = response.data;
      console.log('Token:', token);
      console.log('User data:', userData);
      
      // Save token and user data to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      return userData;
    } catch (err) {
      console.error('Login error details:', err);
      console.error('Login error response:', err.response);
      console.error('Login error message:', err.message);
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.register(userData);
      const { token, ...newUserData } = response.data;
      
      // Save token and user data to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUserData));
      
      setUser(newUserData);
      return newUserData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Update user profile function
  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      // Try to update via API
      let updatedUser;
      try {
        const response = await authAPI.updateProfile(profileData);
        updatedUser = response.data;
      } catch (apiError) {
        console.log('API error, using mock update:', apiError);
        // If API fails, just update locally for demo purposes
        updatedUser = { ...user, ...profileData };
      }
      
      // Update user data in localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update state
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Profile update failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // isSignedIn is true if user is not null
  const isSignedIn = !!user;

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isSignedIn, 
        loading, 
        error,
        login,
        register, 
        logout,
        updateProfile,
        setUser 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;