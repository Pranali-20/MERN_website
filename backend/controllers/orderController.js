const Order = require('../models/Order');
const Meal = require('../models/Meal');
const Store = require('../models/Store');
const { sendEmail, emailTemplates } = require('../utils/sendEmail');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
// CHANGE: Added 'next' to the function signature
const createOrder = async (req, res, next) => {
  try {
    const { store, items, orderType, deliveryAddress, customerNotes, paymentMethod } = req.body;

    // Verify store exists
    const storeDoc = await Store.findById(store);
    if (!storeDoc) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const meal = await Meal.findById(item.meal);
      if (!meal) {
        return res.status(404).json({
          success: false,
          message: `Meal with ID ${item.meal} not found`
        });
      }

      if (!meal.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `${meal.name} is currently not available`
        });
      }

      const itemTotal = meal.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        meal: meal._id,
        quantity: item.quantity,
        price: meal.price
      });
    }

    // Calculate delivery fee and tax
    const deliveryFee = orderType === 'Delivery' ? storeDoc.deliveryFee : 0;
    const tax = totalAmount * 0.05; // 5% tax
    const finalAmount = totalAmount + deliveryFee + tax;

    // Check minimum order amount
    if (totalAmount < storeDoc.minimumOrder) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount is ₹${storeDoc.minimumOrder}`
      });
    }

    // Create order
    const order = await Order.create({
      user: req.user.id,
      store,
      items: orderItems,
      totalAmount,
      deliveryFee,
      tax,
      finalAmount,
      orderType,
      deliveryAddress: orderType === 'Delivery' ? deliveryAddress : undefined,
      customerNotes,
      paymentMethod,
      estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes from now
    });

    // Populate order details
    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email phone')
      .populate('store', 'name address phone')
      .populate('items.meal', 'name image');

    // Send confirmation email
    try {
      const emailTemplate = emailTemplates.orderConfirmation(
        order.orderNumber,
        orderItems.map(item => ({
          name: item.meal.name,
          quantity: item.quantity,
          price: item.price * item.quantity
        })),
        finalAmount
      );
      
      await sendEmail({
        email: req.user.email,
        ...emailTemplate
      });
    } catch (emailError) {
      console.error('Order confirmation email failed:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: populatedOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    // CHANGE: Pass the error to the global Express error handler
    next(error); 
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res, next) => { // Added next
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by date range
    if (req.query.startDate || req.query.endDate) {
      query.createdAt = {};
      if (req.query.startDate) {
        query.createdAt.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        query.createdAt.$lte = new Date(req.query.endDate);
      }
    }

    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .populate('store', 'name address')
      .populate('items.meal', 'name image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pagination: {
        page,
        pages: Math.ceil(total / limit)
      },
      data: orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    next(error); // Changed to next(error)
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res, next) => { // Added next
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('store', 'name address phone')
      .populate('items.meal', 'name image price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order or is admin/owner
    if (order.user._id.toString() !== req.user.id && 
        req.user.role !== 'admin' && 
        req.user.role !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    next(error); // Changed to next(error)
  }
};

// @desc    Get current user's orders
// @route   GET /api/orders/my-orders
// @access  Private
const getUserOrders = async (req, res, next) => { // Added next
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: req.user.id })
      .populate('store', 'name address')
      .populate('items.meal', 'name image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pagination: {
        page,
        pages: Math.ceil(total / limit)
      },
      data: orders
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    next(error); // Changed to next(error)
  }
};

// @desc    Get orders for a specific store
// @route   GET /api/orders/store/:storeId
// @access  Private/Owner/Admin
const getStoreOrders = async (req, res, next) => { // Added next
  try {
    const { storeId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Verify store ownership for owners
    if (req.user.role === 'owner') {
      const store = await Store.findById(storeId);
      if (!store || store.owner.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view orders for this store'
        });
      }
    }

    let query = { store: storeId };

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    const orders = await Order.find(query)
      .populate('user', 'name phone')
      .populate('items.meal', 'name image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pagination: {
        page,
        pages: Math.ceil(total / limit)
      },
      data: orders
    });
  } catch (error) {
    console.error('Get store orders error:', error);
    next(error); // Changed to next(error)
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Owner/Admin
const updateOrderStatus = async (req, res, next) => { // Added next
  try {
    const { status } = req.body;

    const validStatuses = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status'
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify store ownership for owners
    if (req.user.role === 'owner') {
      const store = await Store.findById(order.store);
      if (!store || store.owner.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this order'
        });
      }
    }

    order.status = status;

    // Set delivery time if delivered
    if (status === 'Delivered') {
      order.actualDeliveryTime = new Date();
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    next(error); // Changed to next(error)
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res, next) => { // Added next
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Check if order can be cancelled
    if (['Preparing', 'Ready', 'Out for Delivery', 'Delivered'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    order.status = 'Cancelled';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    next(error); // Changed to next(error)
  }
};

// @desc    Add review to completed order
// @route   POST /api/orders/:id/review
// @access  Private
const addOrderReview = async (req, res, next) => { // Added next
  try {
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to review this order'
      });
    }

    // Check if order is delivered
    if (order.status !== 'Delivered') {
      return res.status(400).json({
        success: false,
        message: 'Can only review delivered orders'
      });
    }

    // Check if already reviewed
    if (order.rating) {
      return res.status(400).json({
        success: false,
        message: 'Order already reviewed'
      });
    }

    order.rating = rating;
    order.review = review;
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Review added successfully',
      data: order
    });
  } catch (error) {
    console.error('Add order review error:', error);
    next(error); // Changed to next(error)
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  getUserOrders,
  getStoreOrders,
  cancelOrder,
  addOrderReview
};