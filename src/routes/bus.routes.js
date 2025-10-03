const express = require('express');
const router = express.Router();
const busController = require('../controllers/bus.controller');

/**
 * @swagger
 * /api/v1/buses:
 *   post:
 *     summary: Create a new bus
 *     tags: [Buses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               licensePlate:
 *                 type: string
 *               model:
 *                 type: string
 *               capacity:
 *                 type: number
 *               routeNumber:
 *                 type: string
 *     responses:
 *       '201':
 *         description: The bus was successfully created
 *       '500':
 *         description: Server error
 */
router.post('/', busController.createBus);

/**
 * @swagger
 * /api/v1/buses:
 *   get:
 *     summary: Retrieve a list of all buses
 *     tags: [Buses]
 *     parameters:
 *       - in: query
 *         name: routeNumber
 *         schema:
 *           type: string
 *         description: Filter buses by route number
 *     responses:
 *       '200':
 *         description: A list of buses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bus'
 */
router.get('/', busController.getBuses);

/**
 * @swagger
 * /api/v1/buses/by-plate/{licensePlate}:
 *   get:
 *     summary: Get a bus by license plate
 *     tags: [Buses]
 *     parameters:
 *       - in: path
 *         name: licensePlate
 *         schema:
 *           type: string
 *         required: true
 *         description: The bus license plate
 *     responses:
 *       '200':
 *         description: The bus description by license plate
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bus'
 *       '404':
 *         description: The bus was not found
 */
router.get('/by-plate/:licensePlate', busController.getBusByPlate);

/**
 * @swagger
 * /api/v1/buses/by-plate/{licensePlate}:
 *   put:
 *     summary: Update a bus by the license plate
 *     tags: [Buses]
 *     parameters:
 *       - in: path
 *         name: licensePlate
 *         schema:
 *           type: string
 *         required: true
 *         description: The bus license plate
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               model:
 *                 type: string
 *               capacity:
 *                 type: number
 *               routeNumber:
 *                 type: string
 *     responses:
 *       '200':
 *         description: The bus was updated
 *       '404':
 *         description: The bus was not found
 */
router.put('/by-plate/:licensePlate', busController.updateBusByPlate);

/**
 * @swagger
 * /api/v1/buses/by-plate/{licensePlate}:
 *   delete:
 *     summary: Delete a bus by license plate
 *     tags: [Buses]
 *     parameters:
 *       - in: path
 *         name: licensePlate
 *         schema:
 *           type: string
 *         required: true
 *         description: The bus license plate
 *     responses:
 *       '200':
 *         description: The bus was deleted
 *       '404':
 *         description: The bus was not found
 */
router.delete('/by-plate/:licensePlate', busController.deleteBusByPlate);

/**
 * @swagger
 * /api/v1/buses/by-plate/{licensePlate}/location:
 *   get:
 *     summary: Get the last known location of a specific bus
 *     tags: [Buses]
 *     parameters:
 *       - in: path
 *         name: licensePlate
 *         schema:
 *           type: string
 *         required: true
 *         description: The bus license plate
 *     responses:
 *       '200':
 *         description: The last known location of the bus
 *       '404':
 *         description: Location data not found for this bus
 */
router.get('/by-plate/:licensePlate/location', busController.getLastLocationByPlate);

module.exports = router;
