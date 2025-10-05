const User = require('../models/User');
const Meal = require('../models/Meal');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pagination: {
        page,
        pages: Math.ceil(total / limit)
      },
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('favoriteItems');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Soft delete - deactivate user instead of removing
    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add meal to favorites
// @route   POST /api/users/favorites/:mealId
// @access  Private
const addToFavorites = async (req, res) => {
  try {
    const { mealId } = req.params;

    // Check if meal exists
    const meal = await Meal.findById(mealId);
    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }

    const user = await User.findById(req.user.id);

    // Check if already in favorites
    if (user.favoriteItems.includes(mealId)) {
      return res.status(400).json({
        success: false,
        message: 'Meal already in favorites'
      });
    }

    user.favoriteItems.push(mealId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Meal added to favorites',
      data: user.favoriteItems
    });
  } catch (error) {
    console.error('Add to favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Remove meal from favorites
// @route   DELETE /api/users/favorites/:mealId
// @access  Private
const removeFromFavorites = async (req, res) => {
  try {
    const { mealId } = req.params;

    const user = await User.findById(req.user.id);

    // Check if in favorites
    if (!user.favoriteItems.includes(mealId)) {
      return res.status(400).json({
        success: false,
        message: 'Meal not in favorites'
      });
    }

    user.favoriteItems = user.favoriteItems.filter(
      item => item.toString() !== mealId
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Meal removed from favorites',
      data: user.favoriteItems
    });
  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user's favorite meals
// @route   GET /api/users/favorites
// @access  Private
const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favoriteItems');

    res.status(200).json({
      success: true,
      count: user.favoriteItems.length,
      data: user.favoriteItems
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  addToFavorites,
  removeFromFavorites,
  getFavorites
};