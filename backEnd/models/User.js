// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['User', 'Chef', 'Admin'], default: 'User' },

    // Optional: Universal profile picture
    profilePicture: { type: String, default: '' },

    chefProfile: {
      specialty: { type: String, default: '' },
      experience: { type: Number, min: 0, default: 0 },
      bio: { type: String, default: '' },
      location: { type: String, default: '' },
      pricing: { type: Number, default: 0 },
      availability: { type: Boolean, default: true },
      socialLinks: {
        instagram: { type: String, default: '' },
        website: { type: String, default: '' }
      },
      gallery: [{ type: String }], // Array of dish images
      // Reviews are stored in 'Review' model and can be populated
    },

    userProfile: {
      preferences: [{ type: String }], // E.g. ["Vegetarian", "Italian Cuisine"]
      favoriteChefs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      location: { type: String, default: '' }
    }
  },
  { timestamps: true }
);

// Middleware: remove chefProfile if user is not a Chef
userSchema.pre('save', function (next) {
  if (this.role === 'Chef') {
    this.userProfile = undefined;
  } else if (this.role === 'User') {
    this.chefProfile = undefined;
  }
  next();
});

module.exports = mongoose.model('User', userSchema);