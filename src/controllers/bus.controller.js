const busService = require('../services/bus.service');

// Handles the logic for the create bus request
const createBus = async (req, res) => {
  try {
    // Basic input validation
    const { licensePlate, model, capacity } = req.body;
    if (!licensePlate || !model || !capacity) {
      // Sends a 400 (Bad Request) error if required fields are missing
      return res.status(400).json({ message: 'License plate, model, and capacity are required.' });
    }

    // Calls the service layer to perform the bus creation logic
    const newBus = await busService.createBus(req.body);

    // Sends a 201 (Created) response with the newly created bus data
    res.status(201).json(newBus);
  } catch (error) {
    // Catches potential errors (like a duplicate license plate)
    // and sends a 500 (Internal Server Error) response
    res.status(500).json({ message: 'Error creating the bus.', error: error.message });
  }
};

// Controller to get buses with optional filtering
const getBuses = async (req, res) => {
  try {
    // Pass the query parameters from the request to the service
    const buses = await busService.getBuses(req.query);
    res.status(200).json(buses);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving buses.', error: error.message });
  }
};

// Controller to get a single bus by its license plate
const getBusByPlate = async (req, res) => {
  try {
    const { licensePlate } = req.params; // Extract licensePlate from URL
    const bus = await busService.getBusByPlate(licensePlate);

    if (!bus) {
      return res.status(404).json({ message: 'Bus not found.' });
    }

    res.status(200).json(bus);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving bus.', error: error.message });
  }
};

// Controller to update a bus's details by its license plate
const updateBusByPlate = async (req, res) => {
  try {
    const { licensePlate } = req.params;
    const updateData = req.body;

    // A simple validation to ensure there's something to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No update data provided.' });
    }

    const updatedBus = await busService.updateBusByPlate(licensePlate, updateData);

    if (!updatedBus) {
      return res.status(404).json({ message: 'Bus not found.' });
    }

    res.status(200).json(updatedBus);
  } catch (error) {
    res.status(500).json({ message: 'Error updating bus.', error: error.message });
  }
};

// Controller to delete a bus by its license plate
const deleteBusByPlate = async (req, res) => {
  try {
    const { licensePlate } = req.params;
    const deletedBus = await busService.deleteBusByPlate(licensePlate);

    if (!deletedBus) {
      return res.status(404).json({ message: 'Bus not found.' });
    }

    // Send a confirmation message
    res.status(200).json({ message: 'Bus deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting bus.', error: error.message });
  }
};

module.exports = {
  createBus,
  getBuses,
  getBusByPlate,
  updateBusByPlate,
  deleteBusByPlate, // Export the new function
};