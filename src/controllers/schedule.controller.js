const scheduleService = require('../services/schedule.service');

// Controller to create a new schedule
const createSchedule = async (req, res) => {
  try {
    const { busId, routeId, departureTime, arrivalTime } = req.body;
    if (!busId || !routeId || !departureTime || !arrivalTime) {
      return res.status(400).json({ message: 'Bus ID, Route ID, Departure Time, and Arrival Time are required.' });
    }

    const newSchedule = await scheduleService.createSchedule(req.body);
    res.status(201).json(newSchedule);
  } catch (error) {
    res.status(500).json({ message: 'Error creating schedule.', error: error.message });
  }
};

// Controller to get a list of schedules with optional filtering
const getSchedules = async (req, res) => {
  try {
    const schedules = await scheduleService.getSchedules(req.query);
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving schedules.', error: error.message });
  }
};

// Controller to get a single schedule by its ID
const getScheduleById = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const schedule = await scheduleService.getScheduleById(scheduleId);

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found.' });
    }

    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving schedule.', error: error.message });
  }
};

// Controller to update a schedule by its ID
const updateScheduleById = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const updateData = req.body;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No update data provided.' });
    }

    const updatedSchedule = await scheduleService.updateScheduleById(scheduleId, updateData);

    if (!updatedSchedule) {
      return res.status(404).json({ message: 'Schedule not found.' });
    }

    res.status(200).json(updatedSchedule);
  } catch (error) {
    res.status(500).json({ message: 'Error updating schedule.', error: error.message });
  }
};

// Controller to delete a schedule by its ID
const deleteScheduleById = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const deletedSchedule = await scheduleService.deleteScheduleById(scheduleId);

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
  getScheduleById,
  updateScheduleById,
  deleteScheduleById, // Export the new function
};