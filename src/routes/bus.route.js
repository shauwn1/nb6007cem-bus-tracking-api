const express = require('express');
const router = express.Router();
const busController = require('../controllers/bus.controller');

// Maps the POST request for /api/v1/buses to the createBus controller function
router.post('/', busController.createBus);

module.exports = router;