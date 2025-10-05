const User = require('../models/User');
const Meal = require('../models/Meal');
const Store = require('../models/Store');
const Order = require('../models/Order');
const Contact = require('../models/Contact');

// @desc    Get public stats for About page
// @route   GET /api/stats
// @access  Public
const getStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalMeals,
      totalStores,
      totalOrders,
      completedOrders
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Meal.countDocuments({ isAvailable: true }),
      Store.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.countDocuments({ status: 'Delivered' })
    ]);

    // Calculate average rating across all meals
    const mealRatings = await Meal.aggregate([
      { $match: { isAvailable: true, rating: { $gt: 0 } } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    const avgMealRating = mealRatings.length > 0 ? mealRatings[0].avgRating : 0;

    // Get popular categories
    const popularCategories = await Meal.aggregate([
      { $match: { isAvailable: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Get service areas
    const serviceAreas = await Store.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$address.area', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalMeals,
          totalStores,
          totalOrders,
          completedOrders,
          avgMealRating: Math.round(avgMealRating * 10) / 10
        },
        popularCategories,
        serviceAreas,
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get detailed dashboard stats
// @route   GET /api/stats/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Basic counts
    const [
      totalUsers,
      totalMeals,
      totalStores,
      totalOrders,
      totalContacts,
      activeUsers,
      newUsersThisMonth,
      ordersThisMonth,
      revenueThisMonth
    ] = await Promise.all([
      User.countDocuments(),
      Meal.countDocuments(),
      Store.countDocuments(),
      Order.countDocuments(),
      Contact.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfMonth }, status: 'Delivered' } },
        { $group: { _id: null, total: { $sum: '$finalAmount' } } }
      ])
    ]);

    const monthlyRevenue = revenueThisMonth.length > 0 ? revenueThisMonth[0].total : 0;

    // Order status distribution
    const orderStatusDistribution = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Daily orders for the last 7 days
    const dailyOrders = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$finalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Top performing stores
    const topStores = await Order.aggregate([
      { $match: { status: 'Delivered' } },
      {
        $group: {
          _id: '$store',
          orderCount: { $sum: 1 },
          revenue: { $sum: '$finalAmount' }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'stores',
          localField: '_id',
          foreignField: '_id',
          as: 'store'
        }
      },
      { $unwind: '$store' },
      {
        $project: {
          name: '$store.name',
          area: '$store.address.area',
          orderCount: 1,
          revenue: 1
        }
      }
    ]);

    // Popular meals
    const popularMeals = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.meal',
          totalOrdered: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      { $sort: { totalOrdered: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'meals',
          localField: '_id',
          foreignField: '_id',
          as: 'meal'
        }
      },
      { $unwind: '$meal' },
      {
        $project: {
          name: '$meal.name',
          category: '$meal.category',
          totalOrdered: 1,
          revenue: 1
        }
      }
    ]);

    // Contact message status distribution
    const contactStatusDistribution = await Contact.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // User role distribution
    const userRoleDistribution = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    // Recent activities (last 10 orders)
    const recentOrders = await Order.find()
      .populate('user', 'name')
      .populate('store', 'name')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('orderNumber status finalAmount createdAt');

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalMeals,
          totalStores,
          totalOrders,
          totalContacts,
          activeUsers,
          newUsersThisMonth,
          ordersThisMonth,
          monthlyRevenue
        },
        charts: {
          orderStatusDistribution,
          dailyOrders,
          contactStatusDistribution,
          userRoleDistribution
        },
        topPerformers: {
          stores: topStores,
          meals: popularMeals
        },
        recentActivity: recentOrders,
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getStats,
  getDashboardStats
};