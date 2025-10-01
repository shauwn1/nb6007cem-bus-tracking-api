const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: true,
  },
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true,
  },
  departureTime: {
    type: Date,
    required: true,
  },
  arrivalTime: { // Estimated arrival time
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Departed', 'Arrived', 'Cancelled'],
    default: 'Scheduled',
  }
}, {
  timestamps: true,
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;