/**
 * @swagger
 * components:
 * schemas:
 * Bus:
 * type: object
 * properties:
 * _id:
 * type: string
 * description: The auto-generated id of the bus.
 * licensePlate:
 * type: string
 * description: The unique license plate of the bus.
 * model:
 * type: string
 * description: The model of the bus.
 * capacity:
 * type: number
 * description: The seating capacity of the bus.
 * routeNumber:
 * type: string
 * description: The route number the bus is assigned to.
 * route:
 * type: object
 * description: The populated route details (available on GET requests).
 *
 * Route:
 * type: object
 * properties:
 * _id:
 * type: string
 * description: The auto-generated id of the route.
 * routeNumber:
 * type: string
 * description: The unique number of the route (e.g., "177").
 * startPoint:
 * type: string
 * description: The starting location of the route.
 * endPoint:
 * type: string
 * description: The ending location of the route.
 * waypoints:
 * type: array
 * items:
 * type: string
 * description: A list of major stops along the route.
 *
 * Schedule:
 * type: object
 * properties:
 * _id:
 * type: string
 * description: The auto-generated id of the schedule.
 * tripCode:
 * type: number
 * description: The auto-incrementing trip code (e.g., 101).
 * busId:
 * type: string
 * description: The ID of the bus for this trip.
 * routeId:
 * type: string
 * description: The ID of the route for this trip.
 * departureTime:
 * type: string
 * format: date-time
 * description: The scheduled departure time.
 * arrivalTime:
 * type: string
 * format: date-time
 * description: The estimated arrival time.
 * status:
 * type: string
 * enum: [Scheduled, Departed, Arrived, Cancelled]
 * description: The current status of the trip.
 *
 * Location:
 * type: object
 * properties:
 * scheduleId:
 * type: string
 * description: The ID of the scheduled trip.
 * coordinates:
 * type: object
 * properties:
 * latitude:
 * type: number
 * description: The latitude of the bus.
 * longitude:
 * type: number
 * description: The longitude of the bus.
 */

/**
 * @swagger
 * tags:
 * - name: Buses
 * description: API for managing buses
 * - name: Routes
 * description: API for managing bus routes
 * - name: Schedules
 * description: API for managing scheduled trips
 * - name: Locations
 * description: API for managing real-time bus locations
 */


/**
 * @swagger
 * components:
 * schemas:
 * // ... (keep your existing Bus, Route, Schedule, Location schemas) ...
 *
 * LiveBusLocation:
 * type: object
 * properties:
 * bus:
 * $ref: '#/components/schemas/Bus'
 * location:
 * type: object
 * properties:
 * latitude:
 * type: number
 * longitude:
 * type: number
 * timestamp:
 * type: string
 * format: date-time
 */