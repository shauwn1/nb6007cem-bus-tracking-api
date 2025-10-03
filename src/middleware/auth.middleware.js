const User = require('../models/user.model');

/**
 * Middleware to authenticate a user based on an API key.
 * It finds the user and attaches them to the request object.
 */
const authenticate = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(401).json({ message: 'Unauthorized: API Key is required.' });
    }

    try {
        const user = await User.findOne({ apiKey: apiKey });
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: Invalid API Key.' });
        }

        // Attach the user object to the request for later use
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error during authentication.' });
    }
};

/**
 * Middleware to check if the authenticated user has one of the required roles.
 * This should be used *after* the authenticate middleware.
 * @param {string[]} requiredRoles - An array of roles that are allowed access.
 */
const checkPermission = (requiredRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized: Authentication required.' });
        }

        const hasPermission = requiredRoles.includes(req.user.role);
        if (!hasPermission) {
            return res.status(403).json({ message: 'Forbidden: You do not have the required permissions.' });
        }

        next();
    };
};

module.exports = { authenticate, checkPermission };