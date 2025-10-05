const express = require('express');
const {
  submitContactForm,
  getContactMessages,
  getContactMessage,
  updateContactMessage,
  deleteContactMessage
} = require('../controllers/contactController');
const { protect, authorize } = require('../middlewares/auth');
const { validateContact } = require('../middlewares/validation');

const router = express.Router();

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post('/', validateContact, submitContactForm);

// @route   GET /api/contact
// @desc    Get all contact messages (Admin only)
// @access  Private/Admin
router.get('/', protect, authorize('admin'), getContactMessages);

// @route   GET /api/contact/:id
// @desc    Get single contact message (Admin only)
// @access  Private/Admin
router.get('/:id', protect, authorize('admin'), getContactMessage);

// @route   PUT /api/contact/:id
// @desc    Update contact message (Admin only)
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), updateContactMessage);

// @route   DELETE /api/contact/:id
// @desc    Delete contact message (Admin only)
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), deleteContactMessage);

module.exports = router;