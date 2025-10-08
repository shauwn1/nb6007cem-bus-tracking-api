const routeService = require('../services/route.service');

// This function handles the request to create a new bus route.
const createRoute = async (req, res) => {
  try {
    // Get the main details for the route from the user's request.
    const { routeNumber, startPoint, endPoint } = req.body;
    // Check if any of the required information is missing.
    if (!routeNumber || !startPoint || !endPoint) {
      // If something is missing, send a "Bad Request" error.
      return res.status(400).json({ message: 'Route number, start point, and end point are required.' });
    }

    // Ask the route service to create the new route with the provided data.
    const newRoute = await routeService.createRoute(req.body);

    // If successful, send a "Created" status and the new route's details.
    res.status(201).json(newRoute);
  } catch (error) {
    // If any other error happens, send a generic server error message.
    res.status(500).json({ message: 'Error creating route.', error: error.message });
  }
};

// This function handles the request to get a list of all routes.
const getRoutes = async (req, res) => {
  try {
    // Ask the route service for a list of routes, passing any filters from the URL (e.g., ?startPoint=Colombo).
    const routes = await routeService.getRoutes(req.query);
    // Send the list of routes back to the user.
    res.status(200).json(routes);
  } catch (error) {
    // If an error occurs, send a server error message.
    res.status(500).json({ message: 'Error retrieving routes.', error: error.message });
  }
};

// This function handles the request to find one specific route by its number.
const getRouteByNumber = async (req, res) => {
  try {
    // Get the route number from the URL parameters (e.g., /routes/177).
    const { routeNumber } = req.params;
    // Ask the route service to find the route with that specific number.
    const route = await routeService.getRouteByNumber(routeNumber);

    // If no route was found.
    if (!route) {
      // Send a "Not Found" error.
      return res.status(404).json({ message: 'Route not found.' });
    }

    // If the route was found, send its details back.
    res.status(200).json(route);
  } catch (error) {
    // If an error occurs, send a server error message.
    res.status(500).json({ message: 'Error retrieving route.', error: error.message });
  }
};

// This function handles the request to update an existing route's details.
const updateRouteByNumber = async (req, res) => {
  try {
    // Get the route number from the URL and the new data from the user's request.
    const { routeNumber } = req.params;
    const updateData = req.body;

    // Check if the user sent any data to update.
    if (Object.keys(updateData).length === 0) {
      // If not, send a "Bad Request" error.
      return res.status(400).json({ message: 'No update data provided.' });
    }

    // Ask the route service to update the route with the new data.
    const updatedRoute = await routeService.updateRouteByNumber(routeNumber, updateData);

    // If the service couldn't find a route to update.
    if (!updatedRoute) {
      // Send a "Not Found" error.
      return res.status(404).json({ message: 'Route not found.' });
    }

    // If successful, send the updated route details back.
    res.status(200).json(updatedRoute);
  } catch (error) {
    // If an error occurs, send a server error message.
    res.status(500).json({ message: 'Error updating route.', error: error.message });
  }
};

// This function handles the request to delete a route.
const deleteRouteByNumber = async (req, res) => {
  try {
    // Get the route number from the URL.
    const { routeNumber } = req.params;
    // Ask the route service to delete the route.
    const deletedRoute = await routeService.deleteRouteByNumber(routeNumber);

    // If the service couldn't find a route to delete.
    if (!deletedRoute) {
      // Send a "Not Found" error.
      return res.status(404).json({ message: 'Route not found.' });
    }

    // If successful, send a confirmation message.
    res.status(200).json({ message: 'Route deleted successfully.' });
  } catch (error) {
    // If an error occurs, send a server error message.
    res.status(500).json({ message: 'Error deleting route.', error: error.message });
  }
};

// This function handles the request to get the live locations of all active buses on a specific route.
const getActiveBusLocationsByRoute = async (req, res) => {
  try {
    // Get the route number from the URL.
    const { routeNumber } = req.params;
    // Ask the route service to find all active buses and their latest locations for this route.
    const locations = await routeService.getActiveBusLocationsByRoute(routeNumber);

    // If no active buses were found on this route.
    if (!locations || locations.length === 0) {
      // Send a "Not Found" error.
      return res.status(404).json({ message: 'No active buses found for this route.' });
    }

    // If active buses were found, send their location data back.
    res.status(200).json(locations);
  } catch (error) {
    // If an error occurs, send a server error message.
    res.status(500).json({ message: 'Error retrieving active bus locations.', error: error.message });
  }
};

module.exports = {
  createRoute,
  getRoutes,
  getRouteByNumber,
  updateRouteByNumber,
  deleteRouteByNumber,
  getActiveBusLocationsByRoute,
};
