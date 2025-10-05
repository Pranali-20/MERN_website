const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Store name is required'],
    trim: true,
    maxlength: [100, 'Store name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required']
    },
    area: {
      type: String,
      required: [true, 'Area is required'],
      enum: ['Sakhrale', 'Takari', 'Islampur', 'Walwa']
    },
    city: {
      type: String,
      default: 'Sangli'
    },
    state: {
      type: String,
      default: 'Maharashtra'
    },
    pincode: {
      type: String,
      match: [/^\d{6}$/, 'Please enter a valid 6-digit pincode']
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    }
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
  },
  email: {
    type: String,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  hours: {
    monday: { open: String, close: String, closed: { type: Boolean, default: false } },
    tuesday: { open: String, close: String, closed: { type: Boolean, default: false } },
    wednesday: { open: String, close: String, closed: { type: Boolean, default: false } },
    thursday: { open: String, close: String, closed: { type: Boolean, default: false } },
    friday: { open: String, close: String, closed: { type: Boolean, default: false } },
    saturday: { open: String, close: String, closed: { type: Boolean, default: false } },
    sunday: { open: String, close: String, closed: { type: Boolean, default: false } }
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
  specialties: [{
    type: String
  }],
  features: [{
    type: String,
    enum: ['WiFi', 'Outdoor Seating', 'Vegan Options', 'Takeout', 'Family-Friendly', 'Fresh Baked Daily', 'Authentic', 'Organic', 'Gluten-Free', 'Sustainable', 'Diner Style', 'Large Portions', 'Classic Menu']
  }],
  popularItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meal'
  }],
  images: [{
    type: String
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  deliveryRadius: {
    type: Number,
    default: 5 // in kilometers
  },
  minimumOrder: {
    type: Number,
    default: 0
  },
  deliveryFee: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for location-based queries
storeSchema.index({ location: '2dsphere' });
storeSchema.index({ 'address.area': 1 });
storeSchema.index({ rating: -1 });
storeSchema.index({ name: 'text', description: 'text' });

// Method to check if store is currently open
storeSchema.methods.isCurrentlyOpen = function() {
  const now = new Date();
  const day = now.toLocaleLowerCase().substring(0, 3); // mon, tue, etc.
  const currentTime = now.toTimeString().substring(0, 5); // HH:MM format
  
  const todayHours = this.hours[day];
  if (!todayHours || todayHours.closed) {
    return false;
  }
  
  return currentTime >= todayHours.open && currentTime <= todayHours.close;
};

module.exports = mongoose.model('Store', storeSchema);