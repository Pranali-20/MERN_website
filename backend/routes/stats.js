const express = require('express');
const { getStats, getDashboardStats } = require('../controllers/statsController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// @route   GET /api/stats
// @desc    Get public stats for About page
// @access  Public
router.get('/', getStats);

// @route   GET /api/stats/dashboard
// @desc    Get detailed dashboard stats (Admin only)
// @access  Private/Admin
router.get('/dashboard', protect, authorize('admin'), getDashboardStats);

module.exports = router;