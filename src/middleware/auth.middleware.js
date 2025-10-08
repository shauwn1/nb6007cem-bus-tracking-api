// Import the User model so we can search for users in the database.
const User = require('../models/user.model');

/**
 * It checks if a user has a valid API key.
 */
const authenticate = async (req, res, next) => {
    // Get the API key from a special header in the request.
    const apiKey = req.headers['x-api-key'];

    // If the user didn't provide an API key at all...
    if (!apiKey) {
        // ...stop them and send an "Unauthorized" error.
        return res.status(401).json({ message: 'Unauthorized: API Key is required.' });
    }

    try {
        // Look in the database for a user who has this exact API key.
        const user = await User.findOne({ apiKey: apiKey });
        // If no user is found with this key...
        if (!user) {
            // ...it's an invalid key, so stop them and send an "Unauthorized" error.
            return res.status(401).json({ message: 'Unauthorized: Invalid API Key.' });
        }

        // If the user was found, attach their details to the request object.
        req.user = user;
        // The user is valid, so let them proceed to the next step.
        next();
    } catch (error) {
        // If a database error occurs, send a server error message.
        res.status(500).json({ message: 'Server error during authentication.' });
    }
};

/**
 * It checks if the authenticated user has the right role (e.g., 'admin' or 'operator').
 * @param {string[]} requiredRoles - A list of roles that are allowed to access the route.
 */
const checkPermission = (requiredRoles) => {
    return (req, res, next) => {
        // First makes sure the user was successfully authenticated and attached to the request.
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized: Authentication required.' });
        }

        // Check if the user's role is in the list of required roles.
        const hasPermission = requiredRoles.includes(req.user.role);
        // If their role is NOT in the list...
        if (!hasPermission) {
            // ...stop them and send a "Forbidden" error. They are a valid user, but they don't have the right permissions.
            return res.status(403).json({ message: 'Forbidden: You do not have the required permissions.' });
        }

        next();
    };
};

module.exports = { authenticate, checkPermission };