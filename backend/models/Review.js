const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  style: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Style',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  text: {
    type: String,
    required: true,
    maxlength: 1000
  }
}, {
  timestamps: true
});

// Ensure one review per user per style
reviewSchema.index({ user: 1, style: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);