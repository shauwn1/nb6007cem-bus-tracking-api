const locationService = require('../services/location.service');

// Controller to handle adding a new location update
const addLocation = async (req, res) => {
  try {
    const { scheduleId, coordinates } = req.body;
    if (!scheduleId || !coordinates || !coordinates.latitude || !coordinates.longitude) {
      return res.status(400).json({ message: 'Schedule ID and valid coordinates are required.' });
    }

    const newLocation = await locationService.addLocation(req.body);
    res.status(201).json(newLocation);
  } catch (error) {
    res.status(500).json({ message: 'Error adding location.', error: error.message });
  }
};

module.exports = {
  addLocation,
};