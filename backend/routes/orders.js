const express = require('express');
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  getUserOrders,
  getStoreOrders,
  cancelOrder,
  addOrderReview
} = require('../controllers/orderController');
const { protect, authorize } = require('../middlewares/auth');
const { validateOrder } = require('../middlewares/validation');

const router = express.Router();

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', protect, validateOrder, createOrder);

// @route   GET /api/orders
// @desc    Get all orders (Admin only)
// @access  Private/Admin
router.get('/', protect, authorize('admin'), getOrders);

// @route   GET /api/orders/my-orders
// @desc    Get current user's orders
// @access  Private
router.get('/my-orders', protect, getUserOrders);

// @route   GET /api/orders/store/:storeId
// @desc    Get orders for a specific store (Owner/Admin only)
// @access  Private/Owner/Admin
router.get('/store/:storeId', protect, authorize('owner', 'admin'), getStoreOrders);

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', protect, getOrder);

// @route   PUT /api/orders/:id/status
// @desc    Update order status (Owner/Admin only)
// @access  Private/Owner/Admin
router.put('/:id/status', protect, authorize('owner', 'admin'), updateOrderStatus);

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel order
// @access  Private
router.put('/:id/cancel', protect, cancelOrder);

// @route   POST /api/orders/:id/review
// @desc    Add review to completed order
// @access  Private
router.post('/:id/review', protect, addOrderReview);

module.exports = router;