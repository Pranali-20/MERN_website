const Meal = require('../models/Meal');

// @desc    Get all meals with filtering and pagination
// @route   GET /api/meals
// @access  Public
const getMeals = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};

    // If user is authenticated and is owner, filter by their meals
    if (req.user && req.user.role === 'owner') {
      query.createdBy = req.user.id;
    } else {
      // For public access, only show available meals
      query.isAvailable = true;
    }

    // Filter by category
    if (req.query.category && req.query.category !== 'All Categories') {
      query.category = req.query.category;
    }

    // Filter by time of day
    if (req.query.timeOfDay && req.query.timeOfDay !== 'Any Time') {
      query.timeOfDay = req.query.timeOfDay;
    }

    // Filter by tags
    if (req.query.tags) {
      const tags = req.query.tags.split(',');
      query.tags = { $in: tags };
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
    }

    // Sort options
    let sortOptions = {};
    switch (req.query.sortBy) {
      case 'Price: Low to High':
        sortOptions = { price: 1 };
        break;
      case 'Price: High to Low':
        sortOptions = { price: -1 };
        break;
      case 'Most Popular':
        sortOptions = { reviewCount: -1 };
        break;
      case 'Highest Rated':
      default:
        sortOptions = { rating: -1, reviewCount: -1 };
        break;
    }

    const meals = await Meal.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name');

    const total = await Meal.countDocuments(query);

    res.status(200).json({
      success: true,
      count: meals.length,
      total,
      pagination: {
        page,
        pages: Math.ceil(total / limit)
      },
      data: meals
    });
  } catch (error) {
    console.error('Get meals error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single meal
// @route   GET /api/meals/:id
// @access  Public
const getMeal = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id).populate('createdBy', 'name');

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }

    // Check if user has favorited this meal
    let isFavorited = false;
    if (req.user) {
      const user = await require('../models/User').findById(req.user.id);
      isFavorited = user.favoriteItems.includes(meal._id);
    }

    res.status(200).json({
      success: true,
      data: {
        ...meal.toObject(),
        isFavorited
      }
    });
  } catch (error) {
    console.error('Get meal error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new meal
// @route   POST /api/meals
// @access  Private/Admin/Owner
const createMeal = async (req, res) => {
  try {
    // Add user to req.body
    req.body.createdBy = req.user.id;

    const meal = await Meal.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Meal created successfully',
      data: meal
    });
  } catch (error) {
    console.error('Create meal error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update meal
// @route   PUT /api/meals/:id
// @access  Private/Admin/Owner
const updateMeal = async (req, res) => {
  try {
    let meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }

    // Check if user owns this meal or is admin
    if (meal.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this meal'
      });
    }

    meal = await Meal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Meal updated successfully',
      data: meal
    });
  } catch (error) {
    console.error('Update meal error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete meal
// @route   DELETE /api/meals/:id
// @access  Private/Admin/Owner
const deleteMeal = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }

    // Check if user owns this meal or is admin
    if (meal.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this meal'
      });
    }

    await Meal.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Meal deleted successfully'
    });
  } catch (error) {
    console.error('Delete meal error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Search meals
// @route   GET /api/meals/search
// @access  Public
const searchMeals = async (req, res) => {
  try {
    const { q, page = 1, limit = 12 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const skip = (page - 1) * limit;

    const meals = await Meal.find({
      $and: [
        { isAvailable: true },
        {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { tags: { $in: [new RegExp(q, 'i')] } }
          ]
        }
      ]
    })
      .sort({ rating: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Meal.countDocuments({
      $and: [
        { isAvailable: true },
        {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { tags: { $in: [new RegExp(q, 'i')] } }
          ]
        }
      ]
    });

    res.status(200).json({
      success: true,
      count: meals.length,
      total,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      },
      data: meals
    });
  } catch (error) {
    console.error('Search meals error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get meals by category
// @route   GET /api/meals/category/:category
// @access  Public
const getMealsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const meals = await Meal.find({
      category,
      isAvailable: true
    })
      .sort({ rating: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Meal.countDocuments({
      category,
      isAvailable: true
    });

    res.status(200).json({
      success: true,
      count: meals.length,
      total,
      pagination: {
        page,
        pages: Math.ceil(total / limit)
      },
      data: meals
    });
  } catch (error) {
    console.error('Get meals by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get meals by time of day
// @route   GET /api/meals/time/:timeOfDay
// @access  Public
const getMealsByTime = async (req, res) => {
  try {
    const { timeOfDay } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const meals = await Meal.find({
      timeOfDay: timeOfDay,
      isAvailable: true
    })
      .sort({ rating: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Meal.countDocuments({
      timeOfDay: timeOfDay,
      isAvailable: true
    });

    res.status(200).json({
      success: true,
      count: meals.length,
      total,
      pagination: {
        page,
        pages: Math.ceil(total / limit)
      },
      data: meals
    });
  } catch (error) {
    console.error('Get meals by time error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getMeals,
  getMeal,
  createMeal,
  updateMeal,
  deleteMeal,
  searchMeals,
  getMealsByCategory,
  getMealsByTime
};