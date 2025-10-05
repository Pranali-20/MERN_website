const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  addToFavorites,
  removeFromFavorites,
  getFavorites
} = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get('/', protect, authorize('admin'), getUsers);

// @route   GET /api/users/favorites
// @desc    Get user's favorite meals
// @access  Private
router.get('/favorites', protect, getFavorites);

// @route   POST /api/users/favorites/:mealId
// @desc    Add meal to favorites
// @access  Private
router.post('/favorites/:mealId', protect, addToFavorites);

// @route   DELETE /api/users/favorites/:mealId
// @desc    Remove meal from favorites
// @access  Private
router.delete('/favorites/:mealId', protect, removeFromFavorites);

// @route   GET /api/users/:id
// @desc    Get single user
// @access  Private/Admin
router.get('/:id', protect, authorize('admin'), getUser);

// @route   PUT /api/users/:id
// @desc    Update user (Admin only)
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user (Admin only)
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;