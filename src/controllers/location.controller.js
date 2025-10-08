const locationService = require('../services/location.service');

// This function handles the request to add a new GPS location update from a bus.
const addLocation = async (req, res) => {
  try {
    // Get the schedule ID and coordinates from the user's request.
    const { scheduleId, coordinates } = req.body;
    // Check if the schedule ID or a complete set of coordinates are missing.
    if (!scheduleId || !coordinates || !coordinates.latitude || !coordinates.longitude) {
      // If anything is missing, send a "Bad Request" error.
      return res.status(400).json({ message: 'Schedule ID and valid coordinates are required.' });
    }

    // Ask the location service to save this new location data to the database.
    const newLocation = await locationService.addLocation(req.body);
    // If successful, send a "Created" status and the new location data.
    res.status(201).json(newLocation);
  } catch (error) {
    // If any other error happens during the process, send a server error message.
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addLocation,
};
