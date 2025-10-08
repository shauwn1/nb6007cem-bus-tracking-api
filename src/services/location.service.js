const Location = require('../models/location.model');

// Saves a new GPS location update to the database.
const addLocation = async (locationData) => {
  try {
    // Create a new location document with the provided data.
    const newLocation = await Location.create(locationData);
    return newLocation;
  } catch (error) {
    // If a database error occurs, pass it to the controller.
    throw new Error(error.message);
  }
};

module.exports = {
  addLocation,
};