const Bus = require('../models/bus.model');

// Contains the core logic for creating a bus in the database
const createBus = async (busData) => {
  try {
    // The Bus.create() method creates a new document based on the model
    // and saves it to the MongoDB database.
    const newBus = await Bus.create(busData);
    return newBus;
  } catch (error) {
    // Propagates any database errors (e.g., unique key violation)
    // up to the controller to be handled.
    throw new Error(error.message);
  }
};

module.exports = {
  createBus,
};