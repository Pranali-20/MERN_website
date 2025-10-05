const Store = require('../models/Store');

// @desc    Get all stores with filtering
// @route   GET /api/stores
// @access  Public
const getStores = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = { isActive: true };

    // Filter by area
    if (req.query.area && req.query.area !== 'All Areas') {
      query['address.area'] = req.query.area;
    }

    // Filter by open status
    if (req.query.openNow === 'true') {
      // This is a simplified check - in production, you'd want more sophisticated time checking
      const currentHour = new Date().getHours();
      // Assuming most stores are open between 6 AM and 10 PM
      if (currentHour >= 6 && currentHour <= 22) {
        query.isActive = true;
      } else {
        // Return empty result if filtering for open stores outside typical hours
        return res.status(200).json({
          success: true,
          count: 0,
          total: 0,
          data: []
        });
      }
    }

    // Filter by rating
    if (req.query.minRating) {
      query.rating = { $gte: parseFloat(req.query.minRating) };
    }

    const stores = await Store.find(query)
      .populate('owner', 'name email')
      .populate('popularItems', 'name price image')
      .sort({ rating: -1, reviewCount: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Store.countDocuments(query);

    res.status(200).json({
      success: true,
      count: stores.length,
      total,
      pagination: {
        page,
        pages: Math.ceil(total / limit)
      },
      data: stores
    });
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single store
// @route   GET /api/stores/:id
// @access  Public
const getStore = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id)
      .populate('owner', 'name email phone')
      .populate('popularItems', 'name price image rating');

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Add current open status
    const storeData = store.toObject();
    storeData.isCurrentlyOpen = store.isCurrentlyOpen();

    res.status(200).json({
      success: true,
      data: storeData
    });
  } catch (error) {
    console.error('Get store error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new store
// @route   POST /api/stores
// @access  Private/Owner/Admin
const createStore = async (req, res) => {
  try {
    // Add owner to req.body
    req.body.owner = req.user.id;

    const store = await Store.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Store created successfully',
      data: store
    });
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update store
// @route   PUT /api/stores/:id
// @access  Private/Owner/Admin
const updateStore = async (req, res) => {
  try {
    let store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Check if user owns this store or is admin
    if (store.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this store'
      });
    }

    store = await Store.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Store updated successfully',
      data: store
    });
  } catch (error) {
    console.error('Update store error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete store
// @route   DELETE /api/stores/:id
// @access  Private/Owner/Admin
const deleteStore = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Check if user owns this store or is admin
    if (store.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this store'
      });
    }

    // Soft delete - deactivate store instead of removing
    store.isActive = false;
    await store.save();

    res.status(200).json({
      success: true,
      message: 'Store deactivated successfully'
    });
  } catch (error) {
    console.error('Delete store error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get stores by area
// @route   GET /api/stores/area/:area
// @access  Public
const getStoresByArea = async (req, res) => {
  try {
    const { area } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const stores = await Store.find({
      'address.area': area,
      isActive: true
    })
      .populate('owner', 'name')
      .populate('popularItems', 'name price image')
      .sort({ rating: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Store.countDocuments({
      'address.area': area,
      isActive: true
    });

    res.status(200).json({
      success: true,
      count: stores.length,
      total,
      pagination: {
        page,
        pages: Math.ceil(total / limit)
      },
      data: stores
    });
  } catch (error) {
    console.error('Get stores by area error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get nearby stores
// @route   GET /api/stores/nearby
// @access  Public
const getNearbyStores = async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const stores = await Store.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      },
      isActive: true
    })
      .populate('owner', 'name')
      .populate('popularItems', 'name price image')
      .limit(20);

    res.status(200).json({
      success: true,
      count: stores.length,
      data: stores
    });
  } catch (error) {
    console.error('Get nearby stores error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Search stores
// @route   GET /api/stores/search
// @access  Public
const searchStores = async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const skip = (page - 1) * limit;

    const stores = await Store.find({
      $and: [
        { isActive: true },
        {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { specialties: { $in: [new RegExp(q, 'i')] } },
            { 'address.area': { $regex: q, $options: 'i' } }
          ]
        }
      ]
    })
      .populate('owner', 'name')
      .populate('popularItems', 'name price image')
      .sort({ rating: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Store.countDocuments({
      $and: [
        { isActive: true },
        {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { specialties: { $in: [new RegExp(q, 'i')] } },
            { 'address.area': { $regex: q, $options: 'i' } }
          ]
        }
      ]
    });

    res.status(200).json({
      success: true,
      count: stores.length,
      total,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      },
      data: stores
    });
  } catch (error) {
    console.error('Search stores error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getStores,
  getStore,
  createStore,
  updateStore,
  deleteStore,
  getStoresByArea,
  getNearbyStores,
  searchStores
};