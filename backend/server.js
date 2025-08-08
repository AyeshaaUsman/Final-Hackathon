const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const styleRoutes = require('./routes/styles');
const reviewRoutes = require('./routes/reviews');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/styles', styleRoutes);
app.use('/api/reviews', reviewRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    seedDatabase();
  })
  .catch(err => console.log('MongoDB connection error:', err));

// Seed database with initial hijab styles
async function seedDatabase() {
  const Style = require('./models/Style');
  
  const existingStyles = await Style.countDocuments();
  if (existingStyles === 0) {
    const styles = [
      {
        name: "Classic Hijab",
        description: "A timeless and elegant hijab style perfect for everyday wear. Features a simple drape that frames the face beautifully.",
        image: "https://i.pinimg.com/736x/73/ee/1c/73ee1c44932ba992bf084eae2371dd32.jpg",
        category: "everyday"
      },
      {
        name: "Turkish Style Hijab",
        description: "A modern Turkish-inspired hijab style with intricate folds and sophisticated draping technique.",
        image: "https://static.vecteezy.com/system/resources/previews/003/705/927/non_2x/cute-girl-hijab-holding-flower-illustration-muslim-girl-with-hijab-cartoon-vector.jpg",
        category: "formal"
      },
      {
        name: "Sport Hijab",
        description: "Comfortable and breathable hijab designed specifically for active lifestyle and sports activities.",
        image: "https://wallpapers.com/images/featured/hijab-cartoon-v008ku5l80t0hn56.jpg",
        category: "sport"
      },
      {
        name: "Elegant Wrap Hijab",
        description: "A sophisticated wrap-style hijab perfect for special occasions and formal events.",
        image: "https://w0.peakpx.com/wallpaper/688/556/HD-wallpaper-hijabi-girl-love-preety-muslimah-cute-pie-anime-nice-flower.jpg",
        category: "formal"
      }
    ];

    await Style.insertMany(styles);
    console.log('Database seeded with hijab styles');
  }
}

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});