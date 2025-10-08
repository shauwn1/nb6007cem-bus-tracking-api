const scheduleService = require('../services/schedule.service');

// This function handles the request to create a new scheduled trip.
const createSchedule = async (req, res) => {
  try {
    // Get the required details from the user's request.
    const { licensePlate, routeNumber, departureTime, arrivalTime } = req.body;
    // Check if any of the required information is missing.
    if (!licensePlate || !routeNumber || !departureTime || !arrivalTime) {
      // If something is missing, send a "Bad Request" error.
      return res.status(400).json({ message: 'License Plate, Route Number, Departure Time, and Arrival Time are required.' });
    }
    // Ask the schedule service to create the new trip.
    const newSchedule = await scheduleService.createSchedule(req.body);
    // If successful, send a "Created" status and the new schedule's details.
    res.status(201).json(newSchedule);
  } catch (error) {
    // If any other error happens, send a generic server error message.
    res.status(500).json({ message: 'Error creating schedule.', error: error.message });
  }
};

// This function handles the request to get a list of all scheduled trips.
const getSchedules = async (req, res) => {
  try {
    // Ask the schedule service for a list of trips, passing any filters from the URL (e.g., ?status=Departed).
    const schedules = await scheduleService.getSchedules(req.query);
    // Send the list of schedules back to the user.
    res.status(200).json(schedules);
  } catch (error) {
    // If an error occurs, send a server error message.
    res.status(500).json({ message: 'Error retrieving schedules.', error: error.message });
  }
};

// This function handles the request to find one specific scheduled trip by its unique trip code.
const getScheduleByCode = async (req, res) => {
  try {
    // Get the trip code from the URL parameters (e.g., /schedules/101).
    const { tripCode } = req.params;
    // Ask the schedule service to find the trip with that code.
    const schedule = await scheduleService.getScheduleByCode(tripCode);

    // If no schedule was found.
    if (!schedule) {
      // Send a "Not Found" error.
      return res.status(404).json({ message: 'Schedule not found.' });
    }
    // If the schedule was found, send its details back.
    res.status(200).json(schedule);
  } catch (error) {
    // If an error occurs, send a server error message.
    res.status(500).json({ message: 'Error retrieving schedule.', error: error.message });
  }
};

// This function handles the request to update an existing scheduled trip.
const updateScheduleByCode = async (req, res) => {
  try {
    // Get the trip code from the URL and the new data from the user's request.
    const { tripCode } = req.params;
    const updateData = req.body;

    // Check if the user sent any data to update.
    if (Object.keys(updateData).length === 0) {
      // If not, send a "Bad Request" error.
      return res.status(400).json({ message: 'No update data provided.' });
    }

    // Ask the schedule service to update the trip with the new data.
    const updatedSchedule = await scheduleService.updateScheduleByCode(tripCode, updateData);

    // If the service couldn't find a trip to update.
    if (!updatedSchedule) {
      // Send a "Not Found" error.
      return res.status(404).json({ message: 'Schedule not found.' });
    }
    // If successful, send the updated trip details back.
    res.status(200).json(updatedSchedule);
  } catch (error) {
    // If an error occurs, send a server error message.
    res.status(500).json({ message: 'Error updating schedule.', error: error.message });
  }
};

// This function handles the request to delete a scheduled trip.
const deleteScheduleByCode = async (req, res) => {
  try {
    // Get the trip code from the URL.
    const { tripCode } = req.params;
    // Ask the schedule service to delete the trip.
    const deletedSchedule = await scheduleService.deleteScheduleByCode(tripCode);

    // If the service couldn't find a trip to delete.
    if (!deletedSchedule) {
      // Send a "Not Found" error.
      return res.status(404).json({ message: 'Schedule not found.' });
    }
    // If successful, send a confirmation message.
    res.status(200).json({ message: 'Scheduled trip deleted successfully.' });
  } catch (error) {
    // If an error occurs, send a server error message.
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
