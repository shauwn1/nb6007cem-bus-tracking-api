const Route = require('../models/route.model');

// Contains the core logic for creating a route in the database
const createRoute = async (routeData) => {
  try {
    const newRoute = await Route.create(routeData);
    return newRoute;
  } catch (error) {
    // Propagates any database errors (e.g., unique key violation) up to the controller
    throw new Error(error.message);
  }
};

// Service to get routes with filtering
const getRoutes = async (filters) => {
  const query = {};

  if (filters.startPoint) {
    query.startPoint = new RegExp(filters.startPoint, 'i');
  }

  if (filters.endPoint) {
    query.endPoint = new RegExp(filters.endPoint, 'i');
  }
  
  if (filters.routeNumber) {
    query.routeNumber = filters.routeNumber;
  }

  const routes = await Route.find(query);
  return routes;
};

// Service to get a single route by its route number
const getRouteByNumber = async (routeNumber) => {
  const route = await Route.findOne({ routeNumber: routeNumber });
  return route;
};

// Service to update a route by its route number
const updateRouteByNumber = async (routeNumber, updateData) => {
  const updatedRoute = await Route.findOneAndUpdate(
    { routeNumber: routeNumber },
    updateData,
    { new: true, runValidators: true } // Return the updated document
  );
  return updatedRoute;
};

// Service to delete a route by its route number
const deleteRouteByNumber = async (routeNumber) => {
  const deletedRoute = await Route.findOneAndDelete({ routeNumber: routeNumber });
  return deletedRoute;
};

module.exports = {
  createRoute,
  getRoutes,
  getRouteByNumber,
  updateRouteByNumber,
  deleteRouteByNumber,
};