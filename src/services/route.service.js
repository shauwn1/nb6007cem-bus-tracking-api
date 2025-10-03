const Route = require('../models/route.model');
const Schedule = require('../models/schedule.model');
const Location = require('../models/location.model');

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

// Service to get live locations of all active buses on a route
const getActiveBusLocationsByRoute = async (routeNumber) => {
  // 1. Find the route by its number
  const route = await Route.findOne({ routeNumber: routeNumber });
  if (!route) {
    throw new Error('Route not found');
  }

  // 2. Find all active (departed) schedules for this route
  const activeSchedules = await Schedule.find({
    routeId: route._id,
    status: 'Departed'
  }).populate('busId'); // Populate bus details

  if (activeSchedules.length === 0) {
    return []; // No active buses on this route
  }

  // 3. For each active schedule, find its latest location
  const locationPromises = activeSchedules.map(schedule => {
    return Location.findOne({ scheduleId: schedule._id })
      .sort({ timestamp: -1 })
      .then(location => {
        if (location) {
          // Combine bus info with location info for a useful response
          return {
            bus: schedule.busId, // The populated bus details
            location: location.coordinates,
            timestamp: location.timestamp
          };
        }
        return null;
      });
  });

  // Wait for all location lookups to complete
  const locations = await Promise.all(locationPromises);

  // Filter out any buses that have a schedule but no location data yet
  return locations.filter(loc => loc !== null);
};

module.exports = {
  createRoute,
  getRoutes,
  getRouteByNumber,
  updateRouteByNumber,
  deleteRouteByNumber,
  getActiveBusLocationsByRoute, // Export the new function
};