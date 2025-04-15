// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if MONGO_URI is available
    if (!process.env.MONGO_URI || process.env.MONGO_URI === 'mock') {
      console.log('Using mock database - no actual MongoDB connection');
      // Don't actually connect, just return success
      return Promise.resolve({
        connection: { host: 'mock-database' }
      });
    }
    
    // Connect to actual MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error; // Let the server.js handle this
  }
};

module.exports = connectDB;