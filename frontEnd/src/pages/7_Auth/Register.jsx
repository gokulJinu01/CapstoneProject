import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Layout/Footer';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/auth/register', { name, email, password, role })
      .then(response => {
        navigate('/login');
      })
      .catch(err => {
        console.error('Registration error:', err);
        setError('Registration failed.');
      });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-20 max-w-md mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mt-10">Register</h1>
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="User">User</option>
              <option value="Chef">Chef</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-[#D4AF37] text-white py-2 rounded hover:bg-[#C19B2E] transition-colors"
          >
            Register
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Register;