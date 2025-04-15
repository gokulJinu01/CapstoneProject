// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['User', 'Chef', 'Admin'], default: 'User' },

    // Universal profile picture
    profilePicture: { type: String, default: '' },

    chefProfile: {
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

    userProfile: {
      preferences: [{ type: String }], // E.g. ["Vegetarian", "Italian Cuisine"]
      favoriteChefs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      location: { type: String, default: '' },
      phone: { type: String, default: '' },
      address: { type: String, default: '' },
      dietary_preferences: [{ type: String }],
      allergies: [{ type: String }],
      bio: { type: String, default: '' }
    }
  },
  { timestamps: true }
);

// Don't remove profiles based on role, just allow both types of profiles
// This prevents errors with frontend implementations that expect both profile types

module.exports = mongoose.model('User', userSchema);