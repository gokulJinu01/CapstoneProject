// server.js
require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

// Connect to database
connectDB()
  .then(() => {
    console.log('Database connection established');
    
    // Set port
    const PORT = process.env.PORT || 5001;

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Visit http://localhost:${PORT} to access the API`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  }); 