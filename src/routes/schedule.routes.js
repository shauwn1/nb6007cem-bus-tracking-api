const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/schedule.controller');
const { authenticate, checkPermission } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /api/v1/schedules:
 *   post:
 *     summary: Schedule a new trip (Admin or Operator Only)
 *     tags: [Schedules]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               licensePlate:
 *                 type: string
 *               routeNumber:
 *                 type: string
 *               departureTime:
 *                 type: string
 *                 format: date-time
 *               arrivalTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       '201':
 *         description: The trip was successfully scheduled
 *       '401':
 *         description: Unauthorized - API Key missing or invalid
 *       '403':
 *         description: Forbidden - Insufficient permissions
 */
router.post('/', authenticate, checkPermission(['admin', 'operator']), scheduleController.createSchedule);


/**
 * @swagger
 * /api/v1/schedules:
 *   get:
 *     summary: Retrieve a list of all scheduled trips
 *     tags: [Schedules]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter schedules by a specific date (YYYY-MM-DD)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Scheduled, Departed, Arrived, Cancelled]
 *         description: Filter schedules by status
 *     responses:
 *       '200':
 *         description: A list of scheduled trips
 */
router.get('/', scheduleController.getSchedules);

/**
 * @swagger
 * /api/v1/schedules/{tripCode}:
 *   get:
 *     summary: Get a scheduled trip by its trip code
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: tripCode
 *         schema:
 *           type: number
 *         required: true
 *         description: The trip code
 *     responses:
 *       '200':
 *         description: The scheduled trip details
 *       '404':
 *         description: The schedule was not found
 */
router.get('/:tripCode', scheduleController.getScheduleByCode);

/**
 * @swagger
 * /api/v1/schedules/{tripCode}:
 *   put:
 *     summary: Update a scheduled trip (Admin or Operator Only)
 *     tags: [Schedules]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: tripCode
 *         required: true
 *         schema:
 *           type: number
 *         description: The trip code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Scheduled, Departed, Arrived, Cancelled]
 *     responses:
 *       '200':
 *         description: The schedule was updated
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 */
router.put('/:tripCode', authenticate, checkPermission(['admin', 'operator']), scheduleController.updateScheduleByCode);


/**
 * @swagger
 * /api/v1/schedules/{tripCode}:
 *   delete:
 *     summary: Delete a scheduled trip (Admin or Operator Only)
 *     tags: [Schedules]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: tripCode
 *         required: true
 *         schema:
 *           type: number
 *         description: The trip code
 *     responses:
 *       '200':
 *         description: The schedule was deleted
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 */
router.delete('/:tripCode', authenticate, checkPermission(['admin', 'operator']), scheduleController.deleteScheduleByCode);

module.exports = router;
