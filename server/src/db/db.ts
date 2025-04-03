import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './.env' });

// MongoDB URI from .env
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  throw new Error('MONGO_URI is not defined. Check your .env file.');
}

// Function to connect to MongoDB
export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB successfully!');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};
