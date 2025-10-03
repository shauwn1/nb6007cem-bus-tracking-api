const express = require('express');
const router = express.Router();
const locationController = require('../controllers/location.controller');

/**
 * @swagger
 * /api/v1/locations:
 *   post:
 *     summary: Receive a live GPS update from a bus
 *     tags: [Locations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Location'
 *     responses:
 *       '201':
 *         description: The location was successfully recorded.
 *       '500':
 *         description: Server error
 */
router.post('/', locationController.addLocation);

module.exports = router;
