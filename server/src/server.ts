import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { connectDB } from './db/db';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import lessonRoutes from './routes/lessonRoutes';
import attemptsRoutes from './routes/attemptsRoutes';
import progressRoutes from './routes/progressRoutes';
import reviewRoutes from './routes/reviewRoutes';
//import galleryRoutes from './routes/galleryRoutes';

dotenv.config({ path: './.env' });

const app = express();

app.use(cors({
  origin: true, // reflect request origin
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET','POST','PATCH','PUT','DELETE','OPTIONS'],
}));

app.use(bodyParser.json());

// Connect DB
connectDB()
  .then(() => console.log('Database connected'))
  .catch((err) => {
    console.error('DB connection failed:', err);
    process.exit(1);
  });

// Root endpoint
app.get('/home', (_req: Request, res: Response) => {
  res.send('Welcome to the AI Model API');
});

// Centralized API routing
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/attempts', attemptsRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/review', reviewRoutes);
//app.use('/api/gallery', galleryRoutes);

// Centralized error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res
    .status(err?.status || 500)
    .json({ error: err?.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server is running on port ${PORT}`)
);

//localhost:5000/api/gallery/a9s8d6f987a65sd987f65987asd6f9876asd9f876