const { body, validationResult } = require('express-validator');

// Validation middleware to check for errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User registration validation
const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .matches(/^\d{10}$/)
    .withMessage('Please provide a valid 10-digit phone number'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

// User login validation
const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Meal validation
const validateMeal = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Meal name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .isIn(['Pancakes', 'Street Food', 'South Indian', 'Maharashtrian', 'Snacks', 'Chaats', 'Breakfast', 'Beverages'])
    .withMessage('Please select a valid category'),
  body('timeOfDay')
    .isIn(['morning', 'afternoon', 'evening'])
    .withMessage('Please select a valid time of day'),
  body('preparationTime')
    .isInt({ min: 1 })
    .withMessage('Preparation time must be at least 1 minute'),
  body('image')
    .trim()
    .notEmpty()
    .withMessage('Image URL is required'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('isAvailable')
    .optional()
    .isBoolean()
    .withMessage('isAvailable must be a boolean'),
  handleValidationErrors
];

// Store validation
const validateStore = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Store name must be between 2 and 100 characters'),
  body('address.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  body('address.area')
    .isIn(['Sakhrale', 'Takari', 'Islampur', 'Walwa'])
    .withMessage('Please select a valid area'),
  body('phone')
    .matches(/^\d{10}$/)
    .withMessage('Please provide a valid 10-digit phone number'),
  handleValidationErrors
];

// Contact form validation
const validateContact = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('category')
    .isIn(['General Inquiry', 'Partnership Opportunities', 'Technical Support', 'Feedback & Suggestions', 'Billing & Orders', 'Other'])
    .withMessage('Please select a valid category'),
  body('subject')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Subject must be between 5 and 100 characters'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters'),
  handleValidationErrors
];

// Order validation
const validateOrder = [
  body('store')
    .isMongoId()
    .withMessage('Please provide a valid store ID'),
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('items.*.meal')
    .isMongoId()
    .withMessage('Please provide valid meal IDs'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('orderType')
    .isIn(['Pickup', 'Delivery'])
    .withMessage('Please select a valid order type'),
  body('paymentMethod')
    .isIn(['Cash on Delivery', 'Online Payment', 'UPI'])
    .withMessage('Please select a valid payment method'),
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateMeal,
  validateStore,
  validateContact,
  validateOrder,
  handleValidationErrors
};