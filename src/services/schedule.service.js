const Schedule = require('../models/schedule.model');

// Service to create a new schedule
const createSchedule = async (scheduleData) => {
  try {
    // You could add logic here to prevent double-booking a bus for the same time
    const newSchedule = await Schedule.create(scheduleData);
    return newSchedule;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Service to get schedules with filtering
const getSchedules = async (filters) => {
  const query = {};

  if (filters.routeId) {
    query.routeId = filters.routeId;
  }

  // If a date is provided, find all schedules for that entire day
  if (filters.date) {
    const startDate = new Date(filters.date);
    startDate.setUTCHours(0, 0, 0, 0); // Start of the day in UTC

    const endDate = new Date(filters.date);
    endDate.setUTCHours(23, 59, 59, 999); // End of the day in UTC
    
    query.departureTime = {
      $gte: startDate, // Greater than or equal to the start of the day
      $lte: endDate,   // Less than or equal to the end of the day
    };
  }

  // Populate busId and routeId to include their full details in the response
  const schedules = await Schedule.find(query)
    .populate('busId')
    .populate('routeId');
    
  return schedules;
};

// Service to get a single schedule by its ID
const getScheduleById = async (scheduleId) => {
  // Use Mongoose's findById and populate the bus and route details
  const schedule = await Schedule.findById(scheduleId)
    .populate('busId')
    .populate('routeId');
    
  return schedule;
};

// Service to update a schedule by its ID
const updateScheduleById = async (scheduleId, updateData) => {
  const updatedSchedule = await Schedule.findByIdAndUpdate(
    scheduleId,
    updateData,
    { new: true, runValidators: true } // Return the updated document
  )
    .populate('busId')
    .populate('routeId');
    
  return updatedSchedule;
};

// Service to delete a schedule by its ID
const deleteScheduleById = async (scheduleId) => {
  const deletedSchedule = await Schedule.findByIdAndDelete(scheduleId);
  return deletedSchedule;
};

module.exports = {
  createSchedule,
  getSchedules,
  getScheduleById,
  updateScheduleById,
  deleteScheduleById, // Export the new function
};