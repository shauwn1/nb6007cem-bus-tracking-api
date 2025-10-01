const express = require('express');
const router = express.Router();
const routeController = require('../controllers/route.controller');

// POST /api/v1/routes
router.post('/', routeController.createRoute);

// GET /api/v1/routes
router.get('/', routeController.getRoutes);

// GET /api/v1/routes/:routeNumber
router.get('/:routeNumber', routeController.getRouteByNumber);

router.put('/:routeNumber', routeController.updateRouteByNumber);

// DELETE /api/v1/routes/:routeNumber
router.delete('/:routeNumber', routeController.deleteRouteByNumber);

module.exports = router;