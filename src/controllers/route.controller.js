const routeService = require('../services/route.service');

// Handles the logic for the create route request
const createRoute = async (req, res) => {
  try {
    // Basic input validation
    const { routeNumber, startPoint, endPoint } = req.body;
    if (!routeNumber || !startPoint || !endPoint) {
      return res.status(400).json({ message: 'Route number, start point, and end point are required.' });
    }

    const newRoute = await routeService.createRoute(req.body);

    res.status(201).json(newRoute);
  } catch (error) {
    res.status(500).json({ message: 'Error creating route.', error: error.message });
  }
};

// Controller to get a list of routes with optional filtering
const getRoutes = async (req, res) => {
  try {
    const routes = await routeService.getRoutes(req.query);
    res.status(200).json(routes);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving routes.', error: error.message });
  }
};

// Controller to get a single route by its number
const getRouteByNumber = async (req, res) => {
  try {
    const { routeNumber } = req.params;
    const route = await routeService.getRouteByNumber(routeNumber);

    if (!route) {
      return res.status(404).json({ message: 'Route not found.' });
    }

    res.status(200).json(route);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving route.', error: error.message });
  }
};

// Controller to update a route by its number
const updateRouteByNumber = async (req, res) => {
  try {
    const { routeNumber } = req.params;
    const updateData = req.body;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No update data provided.' });
    }

    const updatedRoute = await routeService.updateRouteByNumber(routeNumber, updateData);

    if (!updatedRoute) {
      return res.status(404).json({ message: 'Route not found.' });
    }

    res.status(200).json(updatedRoute);
  } catch (error) {
    res.status(500).json({ message: 'Error updating route.', error: error.message });
  }
};

// Controller to delete a route by its number
const deleteRouteByNumber = async (req, res) => {
  try {
    const { routeNumber } = req.params;
    const deletedRoute = await routeService.deleteRouteByNumber(routeNumber);

    if (!deletedRoute) {
      return res.status(404).json({ message: 'Route not found.' });
    }

    res.status(200).json({ message: 'Route deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting route.', error: error.message });
  }
};

// Controller to get live locations of all active buses on a route
const getActiveBusLocationsByRoute = async (req, res) => {
  try {
    const { routeNumber } = req.params;
    const locations = await routeService.getActiveBusLocationsByRoute(routeNumber);

    if (!locations || locations.length === 0) {
      return res.status(404).json({ message: 'No active buses found for this route.' });
    }

    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving active bus locations.', error: error.message });
  }
};

module.exports = {
  createRoute,
  getRoutes,
  getRouteByNumber,
  updateRouteByNumber,
  deleteRouteByNumber,
  getActiveBusLocationsByRoute, // Export the new function
};