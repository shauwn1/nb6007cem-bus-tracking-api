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

module.exports = {
  createBus,
};