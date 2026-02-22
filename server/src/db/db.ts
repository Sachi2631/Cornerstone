import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './.env' });

// MongoDB URI from .env
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  throw new Error('MONGO_URI is not defined. Check your .env file.');
}

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(mongoURI);

    console.log('Connected to MongoDB successfully!');
    console.log('Connected to DB:', mongoose.connection.name);

  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};