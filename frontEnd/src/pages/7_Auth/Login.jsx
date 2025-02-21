import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Layout/Footer';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const { setUser } = useContext(AuthContext); // Assuming you have an AuthContext
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/auth/login', { email, password })
      .then(response => {
        // Assuming the response contains { token, user }
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        navigate('/');
      })
      .catch(err => {
        console.error('Login error:', err);
        setError('Invalid credentials.');
      });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-20 max-w-md mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mt-10">Login</h1>
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#D4AF37] text-white py-2 rounded hover:bg-[#C19B2E] transition-colors"
          >
            Login
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Login;