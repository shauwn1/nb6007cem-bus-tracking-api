const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  licensePlate: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  model: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  // Add a reference to the Route model
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route', // This links to the 'Route' model
    required: false, // Make it optional for now
  }
}, {
  timestamps: true,
});

const Bus = mongoose.model('Bus', busSchema);

module.exports = Bus;