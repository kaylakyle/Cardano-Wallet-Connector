const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  stakeAddress: {
    type: String,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'dark'
    },
    notifications: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

// Keep only these indexes
userSchema.index({ walletAddress: 1 }, { unique: true }); // Add unique here instead
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', userSchema);