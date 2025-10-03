const Bus = require('../models/bus.model');
const Route = require('../models/route.model');
const Schedule = require('../models/schedule.model');
const Location = require('../models/location.model');

// This function is correct as it just passes data.
const createBus = async (busData) => {
  try {
    const newBus = await Bus.create(busData);
    return newBus;
  } catch (error) {
    throw new Error(error.message);
  }
};

// CORRECTED SERVICE FOR GETTING BUSES
const getBuses = async (filters) => {
  const { routeNumber, startPoint, endPoint } = filters;
  let query = {};

  if (routeNumber) {
    // Query directly on the routeNumber field in the Bus model
    query.routeNumber = routeNumber;
  }

  if (startPoint || endPoint) {
    const routeQuery = {};
    if (startPoint) {
      routeQuery.startPoint = new RegExp(startPoint, 'i');
    }
    if (endPoint) {
      routeQuery.endPoint = new RegExp(endPoint, 'i');
    }

    const matchingRoutes = await Route.find(routeQuery).select('routeNumber');
    const matchingRouteNumbers = matchingRoutes.map(route => route.routeNumber);
    
    if (matchingRouteNumbers.length === 0) {
      return [];
    }
    
    // Find buses where the routeNumber is one of the matched numbers
    query.routeNumber = { $in: matchingRouteNumbers };
  }

  // Use the new virtual field 'route' for population
  const buses = await Bus.find(query).populate('route');
  return buses;
};

// CORRECTED SERVICE FOR GETTING A SINGLE BUS
const getBusByPlate = async (licensePlate) => {
  const bus = await Bus.findOne({ licensePlate: licensePlate }).populate('route');
  return bus;
};

// CORRECTED SERVICE FOR UPDATING A BUS
const updateBusByPlate = async (licensePlate, updateData) => {
  const updatedBus = await Bus.findOneAndUpdate(
    { licensePlate: licensePlate },
    updateData,
    { new: true, runValidators: true }
  ).populate('route');
  return updatedBus;
};

// This function is correct as it doesn't involve routes.
const deleteBusByPlate = async (licensePlate) => {
  const deletedBus = await Bus.findOneAndDelete({ licensePlate: licensePlate });
  return deletedBus;
};

// This function is correct as it uses the bus._id internally.
const getLastLocationByPlate = async (licensePlate) => {
  const bus = await Bus.findOne({ licensePlate: licensePlate });
  if (!bus) {
    throw new Error('Bus not found');
  }

  const schedule = await Schedule.findOne({ 
    busId: bus._id,
    status: 'Departed'
  }).sort({ departureTime: -1 });

  if (!schedule) {
    return null;
  }

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