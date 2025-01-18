// Import dependencies
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config({ path: '../.env' }); // Adjust path to locate .env

// Import database connection
const { connectDB } = require('./db/db.js');

// Create an instance of Express
const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse incoming JSON requests

// Connect to MongoDB
connectDB()
  .then(() => {
    console.log('Database connection established, starting the server...');
  })
  .catch((err) => {
    console.error('Failed to connect to the database. Exiting...', err);
    process.exit(1); // Exit process if the database connection fails
  });

// Define routes
app.get('/', (req, res) => {
  res.send('Welcome to the AI Model API');
});

// Example route for API
app.post('/api/model', async (req, res) => {
  try {
    const inputData = req.body; // Get data from the request body

    // Process the inputData here as needed
    const modelOutput = `Processed data: ${JSON.stringify(inputData)}`;

    res.json({ output: modelOutput });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000; // Default to port 5000 if PORT is not in .env
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
