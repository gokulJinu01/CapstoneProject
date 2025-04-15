const mongoose = require('mongoose');

const chefSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    specialty: { type: String, default: '' },
    experience: { type: String, default: '' },
    bio: { type: String, default: '' },
    location: { type: String, default: '' },
    hourlyRate: { type: Number, default: 100 },
    availability: { type: Boolean, default: false },
    cuisines: [{ type: String }], // Array of cuisines
    featured: { type: Boolean, default: false },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    image: { type: String, default: '' },
    gallery: [{ type: String }] // Array of dish/work images
  },
  { timestamps: true }
);

module.exports = mongoose.model('Chef', chefSchema); 