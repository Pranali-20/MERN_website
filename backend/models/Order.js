const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  meal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meal',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount cannot be negative']
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  finalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  orderType: {
    type: String,
    enum: ['Pickup', 'Delivery'],
    required: true
  },
  deliveryAddress: {
    street: String,
    area: String,
    city: String,
    pincode: String,
    landmark: String
  },
  customerNotes: {
    type: String,
    maxlength: [200, 'Notes cannot exceed 200 characters']
  },
  estimatedDeliveryTime: {
    type: Date
  },
  actualDeliveryTime: {
    type: Date
  },
  paymentMethod: {
    type: String,
    enum: ['Cash on Delivery', 'Online Payment', 'UPI'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    maxlength: [500, 'Review cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  // --- START OF CHANGE ---
  try {
    if (!this.orderNumber) {
      const count = await mongoose.model('Order').countDocuments();
      this.orderNumber = `B4U${Date.now()}${String(count + 1).padStart(4, '0')}`;
    }
    next();
  } catch (error) {
    // Crucial: Pass the error to the next middleware/Express error handler
    next(error); 
  }
  // --- END OF CHANGE ---
});

// Index for efficient queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ store: 1, status: 1 });
orderSchema.index({ orderNumber: 1 });

module.exports = mongoose.model('Order', orderSchema);