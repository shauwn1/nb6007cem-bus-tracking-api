const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

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
  arrivalTime: {
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

scheduleSchema.plugin(AutoIncrement, {
  inc_field: 'tripCode',
  id: 'tripCode_counter',
  start_seq: 101,
});

const Schedule = mongoose.model('Schedule', scheduleSchema);
module.exports = Schedule;