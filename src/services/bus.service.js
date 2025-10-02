const Bus = require('../models/bus.model');

// Contains the core logic for creating a bus in the database
const createBus = async (busData) => {
  try {
    // The Bus.create() method creates a new document based on the model
    // and saves it to the MongoDB database.
    const newBus = await Bus.create(busData);
    return newBus;
  } catch (error) {
    // Propagates any database errors (e.g., unique key violation)
    // up to the controller to be handled.
    throw new Error(error.message);
  }
};

// Service to get buses with filtering
const getBuses = async (filters) => {
  const { routeId, startPoint, endPoint } = filters;
  let query = {};

  if (routeId) {
    query.routeId = routeId;
  }

  // Handle the advanced startPoint and endPoint search
  if (startPoint && endPoint) {
    // We need to find routes that contain both the start and end points in their path.
    const routes = await Route.find({}); // Get all routes to check them
    
    const matchingRouteIds = routes.filter(route => {
      // Create the full path for each route
      const fullPath = [route.startPoint.toLowerCase(), ...route.waypoints.map(w => w.toLowerCase()), route.endPoint.toLowerCase()];
      
      const startIndex = fullPath.indexOf(startPoint.toLowerCase());
      const endIndex = fullPath.indexOf(endPoint.toLowerCase());
      
      // The route is a match if both points exist and start comes before end
      return startIndex !== -1 && endIndex !== -1 && startIndex < endIndex;
    }).map(route => route._id);

    if (matchingRouteIds.length === 0) {
      return [];
    }
    
    query.routeId = { $in: matchingRouteIds };
    
  } else if (startPoint || endPoint) {
    // Simplified search if only one point is given
    const routeQuery = {};
    const pointToSearch = startPoint || endPoint;
    
    routeQuery.$or = [
        { startPoint: new RegExp(pointToSearch, 'i') },
        { waypoints: new RegExp(pointToSearch, 'i') },
        { endPoint: new RegExp(pointToSearch, 'i') }
    ];
    
    const matchingRoutes = await Route.find(routeQuery).select('_id');
    const matchingRouteIds = matchingRoutes.map(route => route._id);

    if (matchingRouteIds.length === 0) {
      return [];
    }
    
    query.routeId = { $in: matchingRouteIds };
  }

  const buses = await Bus.find(query).populate('routeId');
  return buses;
};

// Service to get a single bus by its license plate
const getBusByPlate = async (licensePlate) => {
  // Use Mongoose's findOne method to search by the licensePlate field
  const bus = await Bus.findOne({ licensePlate: licensePlate }).populate('routeId');
  return bus;
};

// Service to update a bus's details by its license plate
const updateBusByPlate = async (licensePlate, updateData) => {
  // Use findOneAndUpdate to find the bus and apply the new data.
  // The { new: true } option ensures the method returns the updated document.
  const updatedBus = await Bus.findOneAndUpdate(
    { licensePlate: licensePlate },
    updateData,
    { new: true, runValidators: true }
  ).populate('routeId');

  return updatedBus;
};

// Service to delete a bus by its license plate
const deleteBusByPlate = async (licensePlate) => {
  const deletedBus = await Bus.findOneAndDelete({ licensePlate: licensePlate });
  return deletedBus;
};

// Service to get the last known location of a bus
const getLastLocationByPlate = async (licensePlate) => {
  // 1. Find the bus by its license plate
  const bus = await Bus.findOne({ licensePlate: licensePlate });
  if (!bus) {
    throw new Error('Bus not found');
  }

  // 2. Find the current, active schedule for this bus
  // We'll assume the most recent schedule is the active one for simplicity.
  const schedule = await Schedule.findOne({ 
    busId: bus._id,
    status: 'Departed' // Only track departed buses
  }).sort({ departureTime: -1 }); // Get the latest schedule

  if (!schedule) {
    return null; // No active schedule found for this bus
  }

  // 3. Find the most recent location update for that schedule
  const lastLocation = await Location.findOne({ scheduleId: schedule._id })
    .sort({ timestamp: -1 }); // Sort by timestamp in descending order and get the first one

  return lastLocation;
};

module.exports = {
  createBus,
  getBuses,
  getBusByPlate,
  updateBusByPlate,
  deleteBusByPlate,
  getLastLocationByPlate, // Export the new function
};