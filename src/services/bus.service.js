const Bus = require('../models/bus.model');
const Route = require('../models/route.model');
const Schedule = require('../models/schedule.model');
const Location = require('../models/location.model');

// Creates a new bus document in the database.
const createBus = async (busData) => {
  try {
    // Save the new bus to the database.
    const newBus = await Bus.create(busData);
    return newBus;
  } catch (error) {
    // Pass any database errors up to the controller.
    throw new Error(error.message);
  }
};

// Gets a list of buses, with optional filtering.
const getBuses = async (filters) => {
  const { routeNumber, startPoint, endPoint } = filters;
  let query = {};

  // If a route number is provided, add it to the search query.
  if (routeNumber) {
    query.routeNumber = routeNumber;
  }

  // If a start or end point is provided, find matching routes first.
  if (startPoint || endPoint) {
    const routeQuery = {};
    if (startPoint) {
      // Uses a case-insensitive search.
      routeQuery.startPoint = new RegExp(startPoint, 'i');
    }
    if (endPoint) {
      routeQuery.endPoint = new RegExp(endPoint, 'i');
    }

    // Find all route numbers that match the start/end points.
    const matchingRoutes = await Route.find(routeQuery).select('routeNumber');
    const matchingRouteNumbers = matchingRoutes.map(route => route.routeNumber);
    
    // If no routes were found, return an empty list.
    if (matchingRouteNumbers.length === 0) {
      return [];
    }
    
    // Add the list of matching route numbers to the bus search query.
    query.routeNumber = { $in: matchingRouteNumbers };
  }

  // Find all buses that match the query and include their full route details.
  const buses = await Bus.find(query).populate('route');
  return buses;
};

// Gets a single bus from the database using its license plate.
const getBusByPlate = async (licensePlate) => {
  // Find the bus and include its full route details.
  const bus = await Bus.findOne({ licensePlate: licensePlate }).populate('route');
  return bus;
};

// Finds a bus by its license plate and updates it with new data.
const updateBusByPlate = async (licensePlate, updateData) => {
  // Find the bus and update it, returning the new, updated version.
  const updatedBus = await Bus.findOneAndUpdate(
    { licensePlate: licensePlate },
    updateData,
    { new: true, runValidators: true }
  ).populate('route');
  return updatedBus;
};

// Finds a bus by its license plate and deletes it.
const deleteBusByPlate = async (licensePlate) => {
  // Find and delete the bus from the database.
  const deletedBus = await Bus.findOneAndDelete({ licensePlate: licensePlate });
  return deletedBus;
};

// Gets the last known GPS location for a specific bus.
const getLastLocationByPlate = async (licensePlate) => {
  // Find the bus document.
  const bus = await Bus.findOne({ licensePlate: licensePlate });
  if (!bus) {
    throw new Error('Bus not found');
  }

  // Find the latest "Departed" trip for that bus.
  const schedule = await Schedule.findOne({ 
    busId: bus._id,
    status: 'Departed'
  }).sort({ departureTime: -1 });

  // If there's no active trip, there's no location.
  if (!schedule) {
    return null;
  }

  // Find the most recent location update for that trip.
  const lastLocation = await Location.findOne({ scheduleId: schedule._id })
    .sort({ timestamp: -1 });

  return lastLocation;
};

module.exports = {
  createBus,
  getBuses,
  getBusByPlate,
  updateBusByPlate,
  deleteBusByPlate,
  getLastLocationByPlate,
};
