const Schedule = require('../models/schedule.model');
const Bus = require('../models/bus.model');
const Route = require('../models/route.model');

// This function is correct.
const createSchedule = async (scheduleData) => {
  try {
    const { licensePlate, routeNumber, departureTime, arrivalTime } = scheduleData;
    const bus = await Bus.findOne({ licensePlate: licensePlate });
    if (!bus) throw new Error(`Bus with license plate ${licensePlate} not found.`);
    
    const route = await Route.findOne({ routeNumber: routeNumber });
    if (!route) throw new Error(`Route with number ${routeNumber} not found.`);

    const newSchedule = await Schedule.create({
      busId: bus._id,
      routeId: route._id,
      departureTime,
      arrivalTime
    });
    return newSchedule;
  } catch (error) {
    throw new Error(error.message);
  }
};

// This function is now corrected to filter by status.
const getSchedules = async (filters) => {
  const query = {};

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.date) {
    const startDate = new Date(filters.date);
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date(filters.date);
    endDate.setUTCHours(23, 59, 59, 999);
    query.departureTime = { $gte: startDate, $lte: endDate };
  }

  const schedules = await Schedule.find(query)
    .populate('busId')
    .populate('routeId');
  return schedules;
};

// NEW: Service to get a single schedule by its tripCode
const getScheduleByCode = async (tripCode) => {
  const schedule = await Schedule.findOne({ tripCode: tripCode })
    .populate('busId')
    .populate('routeId');
  return schedule;
};

// CORRECTED: Service to update a schedule by its tripCode
const updateScheduleByCode = async (tripCode, updateData) => {
  const updatedSchedule = await Schedule.findOneAndUpdate(
    { tripCode: tripCode },
    updateData,
    { new: true, runValidators: true }
  )
    .populate('busId')
    .populate('routeId');
  return updatedSchedule;
};

// NEW: Service to delete a schedule by its tripCode
const deleteScheduleByCode = async (tripCode) => {
  const deletedSchedule = await Schedule.findOneAndDelete({ tripCode: tripCode });
  return deletedSchedule;
};

// CORRECTED EXPORTS: Only export the functions that are actually used.
module.exports = {
  createSchedule,
  getSchedules,
  getScheduleByCode,
  updateScheduleByCode,
  deleteScheduleByCode,
};