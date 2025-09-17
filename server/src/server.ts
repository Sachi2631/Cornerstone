import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { connectDB } from './db/db';
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";

dotenv.config({ path: './.env' });

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect DB
connectDB()
  .then(() => console.log('Database connected'))
  .catch((err) => {
    console.error('DB connection failed:', err);
    process.exit(1);
  });

// Root endpoint
app.get('/home', (req: Request, res: Response) => {
  res.send('Welcome to the AI Model API');
});

// Centralized API routing
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
