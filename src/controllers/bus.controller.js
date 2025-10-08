// Import the bus service, which contains the main logic for handling bus data.
const busService = require('../services/bus.service');

// This function handles the request to create a new bus.
const createBus = async (req, res) => {
  try {
    // Get the license plate, model, and capacity from the user's request.
    const { licensePlate, model, capacity } = req.body;
    // Check if any of the required information is missing.
    if (!licensePlate || !model || !capacity) {
      // If something is missing, send a "Bad Request" error.
      return res.status(400).json({ message: 'License plate, model, and capacity are required.' });
    }

    // Ask the bus service to create the new bus with the provided data.
    const newBus = await busService.createBus(req.body);

    // If successful, send a "Created" status and the new bus's details.
    res.status(201).json(newBus);
  } catch (error) {
    // If any other error happens (like a database issue), send a server error message.
    res.status(500).json({ message: 'Error creating the bus.', error: error.message });
  }
};

// This function handles the request to get a list of all buses.
const getBuses = async (req, res) => {
  try {
    // Ask the bus service for a list of buses, passing along any filters from the URL (e.g., ?routeNumber=177).
    const buses = await busService.getBuses(req.query);
    // Send the list of buses back to the user.
    res.status(200).json(buses);
  } catch (error) {
    // If an error occurs, send a server error message.
    res.status(500).json({ message: 'Error retrieving buses.', error: error.message });
  }
};

// This function handles the request to find one specific bus by its license plate.
const getBusByPlate = async (req, res) => {
  try {
    // Get the license plate from the URL parameters (e.g., /buses/by-plate/WP-1234).
    const { licensePlate } = req.params;
    // Ask the bus service to find the bus with that license plate.
    const bus = await busService.getBusByPlate(licensePlate);

    // If no bus was found (the result is null).
    if (!bus) {
      // Send a "Not Found" error.
      return res.status(404).json({ message: 'Bus not found.' });
    }

    // If the bus was found, send its details back.
    res.status(200).json(bus);
  } catch (error) {
    // If any other error occurs, send a server error message.
    res.status(500).json({ message: 'Error retrieving bus.', error: error.message });
  }
};

// This function handles the request to update an existing bus's details.
const updateBusByPlate = async (req, res) => {
  try {
    // Get the license plate from the URL and the new data from the user's request.
    const { licensePlate } = req.params;
    const updateData = req.body;

    // Check if the user sent any data to update. If the body is empty...
    if (Object.keys(updateData).length === 0) {
      // ...send a "Bad Request" error.
      return res.status(400).json({ message: 'No update data provided.' });
    }

    // Ask the bus service to update the bus with the new data.
    const updatedBus = await busService.updateBusByPlate(licensePlate, updateData);

    // If the service couldn't find a bus to update.
    if (!updatedBus) {
      // Send a "Not Found" error.
      return res.status(404).json({ message: 'Bus not found.' });
    }

    // If successful, send the updated bus details back.
    res.status(200).json(updatedBus);
  } catch (error) {
    // If any other error occurs, send a server error message.
    res.status(500).json({ message: 'Error updating bus.', error: error.message });
  }
};

// This function handles the request to delete a bus.
const deleteBusByPlate = async (req, res) => {
  try {
    // Get the license plate from the URL.
    const { licensePlate } = req.params;
    // Ask the bus service to delete the bus.
    const deletedBus = await busService.deleteBusByPlate(licensePlate);

    // If the service couldn't find a bus to delete.
    if (!deletedBus) {
      // Send a "Not Found" error.
      return res.status(404).json({ message: 'Bus not found.' });
    }

    // If successful, send a confirmation message.
    res.status(200).json({ message: 'Bus deleted successfully.' });
  } catch (error) {
    // If an error occurs, send a server error message.
    res.status(500).json({ message: 'Error deleting bus.', error: error.message });
  }
};

// This function handles the request to get the last known location of a bus.
const getLastLocationByPlate = async (req, res) => {
  try {
    // Get the license plate from the URL.
    const { licensePlate } = req.params;
    // Ask the bus service to find the latest location for this bus.
    const location = await busService.getLastLocationByPlate(licensePlate);

    // If no location data was found.
    if (!location) {
      // Send a "Not Found" error.
      return res.status(404).json({ message: 'Location data not found for this bus.' });
    }

    // If a location was found, send it back.
    res.status(200).json(location);
  } catch (error) {
    // If an error occurs, send a server error message.
    res.status(500).json({ message: 'Error retrieving bus location.', error: error.message });
  }
};

// This line makes all the functions in this file available to other files (like bus.routes.js).
module.exports = {
  createBus,
  getBuses,
  getBusByPlate,
  updateBusByPlate,
  deleteBusByPlate,
  getLastLocationByPlate,
};
