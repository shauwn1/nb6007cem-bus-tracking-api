const express = require('express');
const connectDB = require('./config/db');

// Import your new routes
const busRoutes = require('./routes/bus.routes');

// Establish the database connection
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON request bodies. This is essential.
app.use(express.json());

app.get('/', (req, res) => {
  res.send('NTC Bus Tracking API is running!');
});

// Instruct the app to use the busRoutes for any request
// that starts with /api/v1/buses
app.use('/api/v1/buses', busRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});