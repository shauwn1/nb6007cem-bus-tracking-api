const express = require('express');
const router = express.Router();
const locationController = require('../controllers/location.controller');
const { authenticate, checkPermission } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /api/v1/locations:
 *   post:
 *     summary: Receive a live GPS update from a bus (Operator Only)
 *     tags: [Locations]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Location'
 *     responses:
 *       '201':
 *         description: The location was successfully recorded.
 *       '401':
 *         description: Unauthorized - API Key missing or invalid.
 *       '403':
 *         description: Forbidden - Insufficient permissions.
 *       '500':
 *         description: Server error.
 */
router.post('/', authenticate, checkPermission(['operator']), locationController.addLocation);

module.exports = router;
