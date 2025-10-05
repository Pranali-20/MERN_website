const express = require('express');
const {
  getMeals,
  getMeal,
  createMeal,
  updateMeal,
  deleteMeal,
  searchMeals,
  getMealsByCategory,
  getMealsByTime
} = require('../controllers/mealController');
const { protect, authorize, optionalAuth } = require('../middlewares/auth');
const { validateMeal } = require('../middlewares/validation');

const router = express.Router();

// @route   GET /api/meals
// @desc    Get all meals with filtering and pagination
// @access  Public (or filtered by owner if authenticated)
router.get('/', optionalAuth, getMeals);

// @route   GET /api/meals/search
// @desc    Search meals by name or description
// @access  Public
router.get('/search', searchMeals);

// @route   GET /api/meals/category/:category
// @desc    Get meals by category
// @access  Public
router.get('/category/:category', getMealsByCategory);

// @route   GET /api/meals/time/:timeOfDay
// @desc    Get meals by time of day
// @access  Public
router.get('/time/:timeOfDay', getMealsByTime);

// @route   POST /api/meals
// @desc    Create new meal (Admin/Owner only)
// @access  Private/Admin/Owner
router.post('/', protect, authorize('admin', 'owner'), validateMeal, createMeal);

// @route   GET /api/meals/:id
// @desc    Get single meal
// @access  Public
router.get('/:id', optionalAuth, getMeal);

// @route   PUT /api/meals/:id
// @desc    Update meal (Admin/Owner only)
// @access  Private/Admin/Owner
router.put('/:id', protect, authorize('admin', 'owner'), validateMeal, updateMeal);

// @route   DELETE /api/meals/:id
// @desc    Delete meal (Admin/Owner only)
// @access  Private/Admin/Owner
router.delete('/:id', protect, authorize('admin', 'owner'), deleteMeal);

module.exports = router;