const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Meal name is required'],
    trim: true,
    maxlength: [100, 'Meal name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  image: {
    type: String,
    required: [true, 'Image is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Pancakes', 'Street Food', 'South Indian', 'Maharashtrian', 'Snacks', 'Chaats', 'Breakfast', 'Beverages']
  },
  timeOfDay: [{
    type: String,
    enum: ['morning', 'afternoon', 'evening'],
    required: true
  }],
  tags: [{
    type: String,
    enum: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Healthy', 'Protein-Rich', 'Spicy', 'Sweet']
  }],
  preparationTime: {
    type: Number,
    required: [true, 'Preparation time is required'],
    min: [1, 'Preparation time must be at least 1 minute']
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  ingredients: [String],
  allergens: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for search functionality
mealSchema.index({ name: 'text', description: 'text' });
mealSchema.index({ category: 1, timeOfDay: 1 });
mealSchema.index({ rating: -1 });

module.exports = mongoose.model('Meal', mealSchema);