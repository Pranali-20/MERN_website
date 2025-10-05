const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  phone: {
    type: String,
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['General Inquiry', 'Partnership Opportunities', 'Technical Support', 'Feedback & Suggestions', 'Billing & Orders', 'Other']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    maxlength: [100, 'Subject cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['New', 'In Progress', 'Resolved', 'Closed'],
    default: 'New'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  response: {
    type: String
  },
  respondedAt: {
    type: Date
  },
  respondedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for efficient queries
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ category: 1 });
contactSchema.index({ email: 1 });

module.exports = mongoose.model('Contact', contactSchema);