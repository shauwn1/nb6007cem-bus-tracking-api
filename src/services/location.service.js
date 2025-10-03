const Location = require('../models/location.model');

// Service to add a new location update to the database
const addLocation = async (locationData) => {
  try {
    const newLocation = await Location.create(locationData);
    return newLocation;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  addLocation,
};