const Schedule = require('../models/schedule.model');
const Bus = require('../models/bus.model');
const Route = require('../models/route.model');

// Creates a new scheduled trip in the database.
const createSchedule = async (scheduleData) => {
  try {
    const { licensePlate, routeNumber, departureTime, arrivalTime } = scheduleData;

    // Find the bus's internal ID using its license plate.
    const bus = await Bus.findOne({ licensePlate: licensePlate });
    if (!bus) throw new Error(`Bus with license plate ${licensePlate} not found.`);
    
    // Find the route's internal ID using its route number.
    const route = await Route.findOne({ routeNumber: routeNumber });
    if (!route) throw new Error(`Route with number ${routeNumber} not found.`);

    // Create the new schedule using the found IDs.
    const newSchedule = await Schedule.create({
      busId: bus._id,
      routeId: route._id,
      departureTime,
      arrivalTime
    });
    return newSchedule;
  } catch (error) {
    // Pass any database errors up to the controller.
    throw new Error(error.message);
  }
};

// Gets a list of scheduled trips, with optional filtering.
const getSchedules = async (filters) => {
  const query = {};

  // If a status is provided like Departed, add it to the search query.
  if (filters.status) {
    query.status = filters.status;
  }

  // If a date is provided, add it to the search query.
  if (filters.date) {
    const startDate = new Date(filters.date);
    startDate.setUTCHours(0, 0, 0, 0); // Start of the day.
    const endDate = new Date(filters.date);
    endDate.setUTCHours(23, 59, 59, 999); // End of the day.
    // Find trips with a departure time between the start and end of the day.
    query.departureTime = { $gte: startDate, $lte: endDate };
  }

  // Find all schedules that match the query and include their full bus and route details.
  const schedules = await Schedule.find(query)
    .populate('busId')
    .populate('routeId');
  return schedules;
};

// Gets a single scheduled trip from the database using its unique trip code.
const getScheduleByCode = async (tripCode) => {
  // Find the schedule and include its full bus and route details.
  const schedule = await Schedule.findOne({ tripCode: tripCode })
    .populate('busId')
    .populate('routeId');
  return schedule;
};

// Finds a scheduled trip by its trip code and updates it with new data.
const updateScheduleByCode = async (tripCode, updateData) => {
  // Find the trip and update it, returning the new, updated version.
  const updatedSchedule = await Schedule.findOneAndUpdate(
    { tripCode: tripCode },
    updateData,
    { new: true, runValidators: true }
  )
    .populate('busId')
    .populate('routeId');
  return updatedSchedule;
};

// Finds a scheduled trip by its trip code and deletes it.
const deleteScheduleByCode = async (tripCode) => {
  // Find and delete the trip from the database.
  const deletedSchedule = await Schedule.findOneAndDelete({ tripCode: tripCode });
  return deletedSchedule;
};

module.exports = {
  createSchedule,
  getSchedules,
  getScheduleByCode,
  updateScheduleByCode,
  deleteScheduleByCode,
};