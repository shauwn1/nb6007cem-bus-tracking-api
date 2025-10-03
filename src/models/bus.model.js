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
  routeNumber: {
    type: String,
    required: false,
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

busSchema.virtual('route', {
  ref: 'Route',
  localField: 'routeNumber',
  foreignField: 'routeNumber',
  justOne: true
});

const Bus = mongoose.model('Bus', busSchema);
module.exports = Bus;