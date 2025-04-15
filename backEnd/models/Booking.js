// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    chef: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    numberOfGuests: { type: Number, required: true },
    occasion: { type: String },
    menuPreferences: { type: String },
    specialRequests: { type: String },
    location: { type: String, required: true },
    contactPhone: { type: String },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending'
    },
    totalAmount: { type: Number, default: 0 },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending'
    },
    // Store chef details directly in the booking for quicker access
    chefDetails: {
      name: { type: String },
      email: { type: String },
      specialty: { type: String },
      image: { type: String }
    },
    // Store user details directly in the booking for quicker access
    userDetails: {
      name: { type: String },
      email: { type: String }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);