const scheduleService = require('../services/schedule.service');

// This function is correct.
const createSchedule = async (req, res) => {
  try {
    const { licensePlate, routeNumber, departureTime, arrivalTime } = req.body;
    if (!licensePlate || !routeNumber || !departureTime || !arrivalTime) {
      return res.status(400).json({ message: 'License Plate, Route Number, Departure Time, and Arrival Time are required.' });
    }
    const newSchedule = await scheduleService.createSchedule(req.body);
    res.status(201).json(newSchedule);
  } catch (error) {
    res.status(500).json({ message: 'Error creating schedule.', error: error.message });
  }
};

// This function is correct.
const getSchedules = async (req, res) => {
  try {
    const schedules = await scheduleService.getSchedules(req.query);
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving schedules.', error: error.message });
  }
};

// NEW: Controller to get a single schedule by its tripCode
const getScheduleByCode = async (req, res) => {
  try {
    const { tripCode } = req.params;
    const schedule = await scheduleService.getScheduleByCode(tripCode);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found.' });
    }
    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving schedule.', error: error.message });
  }
};

// CORRECTED: This function is now consistent.
const updateScheduleByCode = async (req, res) => {
  try {
    const { tripCode } = req.params;
    const updateData = req.body;
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No update data provided.' });
    }
    const updatedSchedule = await scheduleService.updateScheduleByCode(tripCode, updateData);
    if (!updatedSchedule) {
      return res.status(404).json({ message: 'Schedule not found.' });
    }
    res.status(200).json(updatedSchedule);
  } catch (error) {
    res.status(500).json({ message: 'Error updating schedule.', error: error.message });
  }
};

// NEW: Controller to delete a schedule by its tripCode
const deleteScheduleByCode = async (req, res) => {
  try {
    const { tripCode } = req.params;
    const deletedSchedule = await scheduleService.deleteScheduleByCode(tripCode);
    if (!deletedSchedule) {
      return res.status(404).json({ message: 'Schedule not found.' });
    }
    res.status(200).json({ message: 'Scheduled trip deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting schedule.', error: error.message });
  }
};

module.exports = {
  createSchedule,
  getSchedules,
  getScheduleByCode,
  updateScheduleByCode,
  deleteScheduleByCode,
};