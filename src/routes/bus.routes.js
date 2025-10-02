const express = require('express');
const router = express.Router();
const busController = require('../controllers/bus.controller');

// POST /api/v1/buses
router.post('/', busController.createBus);

// GET /api/v1/buses
router.get('/', busController.getBuses);

// GET /api/v1/buses/by-plate/:licensePlate
router.get('/by-plate/:licensePlate', busController.getBusByPlate);

// PUT /api/v1/buses/by-plate/:licensePlate
router.put('/by-plate/:licensePlate', busController.updateBusByPlate);

// DELETE /api/v1/buses/by-plate/:licensePlate
router.delete('/by-plate/:licensePlate', busController.deleteBusByPlate);

// GET /api/v1/buses/by-plate/:licensePlate/location
router.get('/by-plate/:licensePlate/location', busController.getLastLocationByPlate);

module.exports = router;