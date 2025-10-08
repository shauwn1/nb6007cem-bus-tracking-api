const Route = require('../models/route.model');
const Schedule = require('../models/schedule.model');
const Location = require('../models/location.model');

// Creates a new route document in the database.
const createRoute = async (routeData) => {
  try {
    // Save the new route to the database.
    const newRoute = await Route.create(routeData);
    return newRoute;
  } catch (error) {
    // Pass any database errors up to the controller.
    throw new Error(error.message);
  }
};

// Gets a list of routes, with optional filtering.
const getRoutes = async (filters) => {
  const query = {};

  // If a start point is provided, add it to the search query.
  if (filters.startPoint) {
    // Use a flexible, case-insensitive search.
    query.startPoint = new RegExp(filters.startPoint, 'i');
  }

  // If an end point is provided, add it to the search query.
  if (filters.endPoint) {
    query.endPoint = new RegExp(filters.endPoint, 'i');
  }
  
  // If a route number is provided, add it to the search query.
  if (filters.routeNumber) {
    query.routeNumber = filters.routeNumber;
  }

  // Find all routes in the database that match the query.
  const routes = await Route.find(query);
  return routes;
};

// Gets a single route from the database using its unique route number.
const getRouteByNumber = async (routeNumber) => {
  // Find the route that matches the given number.
  const route = await Route.findOne({ routeNumber: routeNumber });
  return route;
};

// Finds a route by its number and updates it with new data.
const updateRouteByNumber = async (routeNumber, updateData) => {
  // Find the route and update it, returning the new, updated version.
  const updatedRoute = await Route.findOneAndUpdate(
    { routeNumber: routeNumber },
    updateData,
    { new: true, runValidators: true }
  );
  return updatedRoute;
};

// Finds a route by its number and deletes it.
const deleteRouteByNumber = async (routeNumber) => {
  // Find and delete the route from the database.
  const deletedRoute = await Route.findOneAndDelete({ routeNumber: routeNumber });
  return deletedRoute;
};

// Gets the live locations of all active buses currently on a specific route.
const getActiveBusLocationsByRoute = async (routeNumber) => {
  // Find the route document using its number.
  const route = await Route.findOne({ routeNumber: routeNumber });
  if (!route) {
    throw new Error('Route not found');
  }

  // Find all "Departed" trips for that specific route.
  const activeSchedules = await Schedule.find({
    routeId: route._id,
    status: 'Departed'
  }).populate('busId'); // Also fetch the full details of the bus for each trip.

  // If no buses are currently active on this route, return an empty list.
  if (activeSchedules.length === 0) {
    return [];
  }

  // For each active trip, find its most recent location update.
  const locationPromises = activeSchedules.map(schedule => {
    // Find the latest location for this specific trip.
    return Location.findOne({ scheduleId: schedule._id })
      .sort({ timestamp: -1 })
      .then(location => {
        if (location) {
          // If a location is found, create a clean object with the bus and location details.
          return {
            bus: schedule.busId,
            location: location.coordinates,
            timestamp: location.timestamp
          };
        }
        return null; // Return null if no location is found for this trip.
      });
  });

  // Wait for all the location searches to finish.
  const locations = await Promise.all(locationPromises);

  // Remove any trips that didn't have location data.
  return locations.filter(loc => loc !== null);
};

module.exports = {
  createRoute,
  getRoutes,
  getRouteByNumber,
  updateRouteByNumber,
  deleteRouteByNumber,
  getActiveBusLocationsByRoute,
};