const express = require('express');
const router = express.Router();
const routeController = require('../controllers/route.controller');
const { authenticate, checkPermission } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /api/v1/routes:
 *   post:
 *     summary: Create a new bus route (Admin Only)
 *     tags: [Routes]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Route'
 *     responses:
 *       '201':
 *         description: The route was successfully created
 *       '403':
 *         description: Forbidden
 */
router.post('/', authenticate, checkPermission(['admin']), routeController.createRoute);



/**
 * @swagger
 * /api/v1/routes:
 *   get:
 *     summary: Retrieve a list of all routes
 *     tags: [Routes]
 *     parameters:
 *       - in: query
 *         name: startPoint
 *         schema:
 *           type: string
 *         description: Filter routes by starting point
 *       - in: query
 *         name: endPoint
 *         schema:
 *           type: string
 *         description: Filter routes by ending point
 *     responses:
 *       '200':
 *         description: A list of routes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Route'
 */
router.get('/', routeController.getRoutes);

/**
 * @swagger
 * /api/v1/routes/{routeNumber}:
 *   get:
 *     summary: Get a route by its number
 *     tags: [Routes]
 *     parameters:
 *       - in: path
 *         name: routeNumber
 *         schema:
 *           type: string
 *         required: true
 *         description: The route number
 *     responses:
 *       '200':
 *         description: The route details
 *       '404':
 *         description: The route was not found
 */
router.get('/:routeNumber', routeController.getRouteByNumber);

/**
 * @swagger
 * /api/v1/routes/{routeNumber}:
 *   put:
 *     summary: Update a route by its number (Admin Only)
 *     tags: [Routes]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: routeNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: The route number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Route'
 *     responses:
 *       '200':
 *         description: The route was updated
 *       '403':
 *         description: Forbidden
 */
router.put('/:routeNumber', authenticate, checkPermission(['admin']), routeController.updateRouteByNumber);



/**
 * @swagger
 * /api/v1/routes/{routeNumber}:
 *   delete:
 *     summary: Delete a route by its number (Admin Only)
 *     tags: [Routes]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: routeNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: The route number
 *     responses:
 *       '200':
 *         description: The route was deleted
 *       '403':
 *         description: Forbidden
 */
router.delete('/:routeNumber', authenticate, checkPermission(['admin']), routeController.deleteRouteByNumber);



/**
 * @swagger
 * /api/v1/routes/{routeNumber}/buses:
 *   get:
 *     summary: Get real-time locations of all active buses on a specific route
 *     tags: [Routes]
 *     parameters:
 *       - in: path
 *         name: routeNumber
 *         schema:
 *           type: string
 *         required: true
 *         description: The route number
 *     responses:
 *       '200':
 *         description: A list of active buses with their last known locations
 *       '404':
 *         description: No active buses found for this route
 */
router.get('/:routeNumber/buses', routeController.getActiveBusLocationsByRoute);

module.exports = router;
