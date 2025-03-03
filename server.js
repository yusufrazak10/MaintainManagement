const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables from .env file
dotenv.config();

// Middleware to parse JSON request bodies
app.use(express.json()); 
app.use(cors());

// Import routes
const jobRoutes = require('./routes/jobRoutes'); 
//  Use job routes
app.use(jobRoutes);  

// MongoDB connection setup using Mongoose
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    // Exit if DB connection fails
    process.exit(1); 
  });

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export the mongoose connection (optional, for use elsewhere in your app)
module.exports = mongoose;


