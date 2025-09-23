const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  licensePlate: {
    type: String,
    required: true,
    unique: true, // Ensures no two buses have the same license plate
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
}, {
  timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
});

const Bus = mongoose.model('Bus', busSchema);

module.exports = Bus;