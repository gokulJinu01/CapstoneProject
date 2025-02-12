// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('Hire A Chef Backend is running!');
});

// Set PORT to 3000 explicitly
const PORT = 3000;

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));