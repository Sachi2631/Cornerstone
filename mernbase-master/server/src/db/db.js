const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' }); // Adjust path to locate .env

// MongoDB URI from .env
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  throw new Error('MONGO_URI is not defined. Check your .env file.');
}

// Function to connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB successfully!');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

module.exports = { connectDB };
