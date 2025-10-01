const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/schedule.controller');

// POST /api/v1/schedules
router.post('/', scheduleController.createSchedule);

// GET /api/v1/schedules
router.get('/', scheduleController.getSchedules);

// GET /api/v1/schedules/:scheduleId
router.get('/:scheduleId', scheduleController.getScheduleById);

// PUT /api/v1/schedules/:scheduleId
router.put('/:scheduleId', scheduleController.updateScheduleById);

// DELETE /api/v1/schedules/:scheduleId
router.delete('/:scheduleId', scheduleController.deleteScheduleById);

module.exports = router;