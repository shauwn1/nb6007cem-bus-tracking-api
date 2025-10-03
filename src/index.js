// Load environment variables FIRST
require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors'); 

// Import your new routes
const busRoutes = require('./routes/bus.routes');
const routeRoutes = require('./routes/route.routes');
const scheduleRoutes = require('./routes/schedule.routes');
const locationRoutes = require('./routes/location.routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// Establish the database connection
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('NTC Bus Tracking API is running!');
});

// app.get('/api-docs/', (req, res) => {
//   res.redirect('/api-docs');
// });

// Instruct the app to use the busRoutes for any request
// that starts with /api/v1/buses
app.use('/api/v1/buses', busRoutes);
app.use('/api/v1/routes', routeRoutes);
app.use('/api/v1/schedules', scheduleRoutes);
app.use('/api/v1/locations', locationRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});