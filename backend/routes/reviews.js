const express = require('express');
const Review = require('../models/Review');
const Style = require('../models/Style');
const auth = require('../middleware/auth');

const router = express.Router();

// Get reviews for a specific style
router.get('/style/:styleId', async (req, res) => {
  try {
    const reviews = await Review.find({ style: req.params.styleId })
      .populate('user', 'username')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a review (protected route)
router.post('/', auth, async (req, res) => {
  try {
    const { styleId, rating, text } = req.body;

    // Check if style exists
    const style = await Style.findById(styleId);
    if (!style) {
      return res.status(404).json({ message: 'Style not found' });
    }

    // Check if user already reviewed this style
    const existingReview = await Review.findOne({
      user: req.user._id,
      style: styleId
    });

    if (existingReview) {
      return res.status(400).json({ 
        message: 'You have already reviewed this style' 
      });
    }

    // Create review
    const review = new Review({
      user: req.user._id,
      style: styleId,
      rating,
      text
    });

    await review.save();

    // Update style's average rating
    await updateStyleRating(styleId);

    // Populate user info before sending response
    await review.populate('user', 'username');

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to update style's average rating
async function updateStyleRating(styleId) {
  const reviews = await Review.find({ style: styleId });
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
    : 0;

  await Style.findByIdAndUpdate(styleId, {
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews
  });
}

module.exports = router;