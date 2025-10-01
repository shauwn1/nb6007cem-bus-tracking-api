const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  scheduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schedule',
    required: true,
  },
  coordinates: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;