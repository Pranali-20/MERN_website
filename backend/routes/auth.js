const express = require('express');
const { register, login, logout, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const { validateUserRegistration, validateUserLogin } = require('../middlewares/validation');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', validateUserRegistration, register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateUserLogin, login);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', logout);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, getMe);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, updateProfile);

module.exports = router;