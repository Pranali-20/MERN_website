const express = require('express');
const {
  getStores,
  getStore,
  createStore,
  updateStore,
  deleteStore,
  getStoresByArea,
  getNearbyStores,
  searchStores
} = require('../controllers/storeController');
const { protect, authorize } = require('../middlewares/auth');
const { validateStore } = require('../middlewares/validation');

const router = express.Router();

// @route   GET /api/stores
// @desc    Get all stores with filtering
// @access  Public
router.get('/', getStores);

// @route   GET /api/stores/search
// @desc    Search stores by name
// @access  Public
router.get('/search', searchStores);

// @route   GET /api/stores/area/:area
// @desc    Get stores by area
// @access  Public
router.get('/area/:area', getStoresByArea);

// @route   GET /api/stores/nearby
// @desc    Get nearby stores based on coordinates
// @access  Public
router.get('/nearby', getNearbyStores);

// @route   POST /api/stores
// @desc    Create new store (Owner/Admin only)
// @access  Private/Owner/Admin
router.post('/', protect, authorize('owner', 'admin'), validateStore, createStore);

// @route   GET /api/stores/:id
// @desc    Get single store
// @access  Public
router.get('/:id', getStore);

// @route   PUT /api/stores/:id
// @desc    Update store (Owner/Admin only)
// @access  Private/Owner/Admin
router.put('/:id', protect, authorize('owner', 'admin'), validateStore, updateStore);

// @route   DELETE /api/stores/:id
// @desc    Delete store (Owner/Admin only)
// @access  Private/Owner/Admin
router.delete('/:id', protect, authorize('owner', 'admin'), deleteStore);

module.exports = router;