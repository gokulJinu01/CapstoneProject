// models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    chef: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true }, // user’s name or display
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);