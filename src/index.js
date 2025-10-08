// Load all the secret keys and settings from the .env file first.
require('dotenv').config();

// Import the main Express framework for building the web server.
const express = require('express');
// Import the database connection function.
const connectDB = require('./config/db');
// Import the CORS middleware to allow requests from other websites.
const cors = require('cors'); 

// Import all the route handlers for each part of our API.
const busRoutes = require('./routes/bus.routes');
const routeRoutes = require('./routes/route.routes');
const scheduleRoutes = require('./routes/schedule.routes');
const locationRoutes = require('./routes/location.routes');

// Import the necessary packages for our API documentation page (Swagger).
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// Connect to the MongoDB database.
connectDB();

// Create a new Express application.
const app = express();
// Define the port the server will run on.
const PORT = process.env.PORT || 3000;


// Tell Express to automatically parse incoming JSON data.
app.use(express.json());
// Tell Express to allow Cross-Origin Resource Sharing.
app.use(cors());



app.get('/', (req, res) => {
  res.send('NTC Bus Tracking API is running!');
});


// app.get('/api-docs/', (req, res) => {
//   res.redirect('/api-docs');
// });

// Tell the app to use our route handlers for specific URL paths.
app.use('/api/v1/buses', busRoutes);
app.use('/api/v1/routes', routeRoutes);
app.use('/api/v1/schedules', scheduleRoutes);
app.use('/api/v1/locations', locationRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});