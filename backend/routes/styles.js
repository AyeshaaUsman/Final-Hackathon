const express = require('express');
const Style = require('../models/Style');

const router = express.Router();

// Get all styles
router.get('/', async (req, res) => {
  try {
    const styles = await Style.find().sort({ createdAt: -1 });
    res.json(styles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single style
router.get('/:id', async (req, res) => {
  try {
    const style = await Style.findById(req.params.id);
    if (!style) {
      return res.status(404).json({ message: 'Style not found' });
    }
    res.json(style);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;