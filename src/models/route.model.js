const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  routeNumber: {
    type: String,
    required: true,
    unique: true,
  },
  startPoint: {
    type: String,
    required: true,
  },
  waypoints: {
    type: [String],
    required: false, // Make it optional
  },
  endPoint: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Route = mongoose.model('Route', routeSchema);

module.exports = Route;