import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Plus, CreditCard as Edit, Trash2, Star, Save, X, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('morning');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [user, setUser] = useState(null);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/signin');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'owner') {
      alert('Access denied. Owner account required.');
      navigate('/');
      return;
    }

    setUser(parsedUser);
    fetchMeals();
  }, [navigate]);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getMealsByOwner();
      setMeals(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load meals');
      console.error('Error fetching meals:', err);
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = [
    { key: 'morning', label: 'Morning', icon: '🌅', time: '6:00 AM - 11:00 AM' },
    { key: 'afternoon', label: 'Afternoon', icon: '☀️', time: '11:00 AM - 4:00 PM' },
    { key: 'evening', label: 'Evening', icon: '🌆', time: '4:00 PM - 9:00 PM' }
  ];

  const categories = [
    'Pancakes', 'Street Food', 'South Indian', 'Maharashtrian',
    'Snacks', 'Chaats', 'Breakfast', 'Beverages'
  ];

  const tags = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Healthy',
    'Protein-Rich', 'Spicy', 'Sweet'
  ];

  const onSubmit = async (data) => {
    try {
      setError(null);
      setSuccessMessage(null);

      const mealData = {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        image: data.image,
        category: data.category,
        timeOfDay: activeTab,
        tags: data.tags ? (Array.isArray(data.tags) ? data.tags : [data.tags]) : [],
        preparationTime: parseInt(data.preparationTime) || 15,
        isAvailable: true
      };

      if (editingItem) {
        await api.updateMeal(editingItem._id, mealData);
        setSuccessMessage('Meal updated successfully!');
      } else {
        await api.createMeal(mealData);
        setSuccessMessage('Meal added successfully!');
      }

      await fetchMeals();
      setIsAddingItem(false);
      setEditingItem(null);
      reset();

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save meal');
      console.error('Error saving meal:', err);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsAddingItem(true);
    reset({
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      category: item.category,
      tags: item.tags,
      preparationTime: item.preparationTime
    });
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      setError(null);
      await api.deleteMeal(itemId);
      setSuccessMessage('Meal deleted successfully!');
      await fetchMeals();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete meal');
      console.error('Error deleting meal:', err);
    }
  };

  const toggleAvailability = async (item) => {
    try {
      setError(null);
      await api.updateMeal(item._id, {
        ...item,
        isAvailable: !item.isAvailable
      });
      await fetchMeals();
    } catch (err) {
      setError(err.message || 'Failed to update availability');
      console.error('Error toggling availability:', err);
    }
  };

  const cancelForm = () => {
    setIsAddingItem(false);
    setEditingItem(null);
    setError(null);
    reset();
  };

  const filteredMeals = meals.filter(meal => meal.timeOfDay === activeTab);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your menu and availability</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="font-semibold text-gray-900">{user?.name || 'Store Owner'}</p>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem('user');
                  localStorage.removeItem('token');
                  navigate('/');
                }}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
            <div className="h-5 w-5 text-green-600 flex-shrink-0">✓</div>
            <p className="text-green-800">{successMessage}</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Menu by Time Slot</h2>
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {timeSlots.map((slot) => (
              <button
                key={slot.key}
                onClick={() => setActiveTab(slot.key)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-colors ${
                  activeTab === slot.key
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="text-lg">{slot.icon}</span>
                <div className="text-left">
                  <div className="font-semibold">{slot.label}</div>
                  <div className="text-xs opacity-75">{slot.time}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            {timeSlots.find(slot => slot.key === activeTab)?.label} Menu
          </h3>
          <button
            onClick={() => setIsAddingItem(true)}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add New Item</span>
          </button>
        </div>

        {isAddingItem && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-semibold text-gray-900">
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </h4>
              <button
                onClick={cancelForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    {...register('name', { required: 'Item name is required' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter item name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('price', { required: 'Price is required', min: 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    {...register('category', { required: 'Category is required' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preparation Time (minutes) *
                  </label>
                  <input
                    type="number"
                    {...register('preparationTime', { required: 'Preparation time is required', min: 1 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="15"
                  />
                  {errors.preparationTime && (
                    <p className="mt-1 text-sm text-red-600">{errors.preparationTime.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  rows={3}
                  {...register('description', { required: 'Description is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  placeholder="Describe your item..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL *
                </label>
                <input
                  type="url"
                  {...register('image', { required: 'Image URL is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="https://example.com/image.jpg"
                />
                {errors.image && (
                  <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (Optional)
                </label>
                <select
                  multiple
                  {...register('tags')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  size="4"
                >
                  {tags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">Hold Ctrl/Cmd to select multiple tags</p>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center space-x-2"
                >
                  <Save className="h-5 w-5" />
                  <span>{editingItem ? 'Update Item' : 'Add Item'}</span>
                </button>
                <button
                  type="button"
                  onClick={cancelForm}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading meals...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMeals.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3 flex space-x-2">
                      <button
                        onClick={() => toggleAvailability(item)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.isAvailable
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.isAvailable ? 'Available' : 'Unavailable'}
                      </button>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-white px-2 py-1 rounded-full">
                      <span className="text-lg font-bold text-orange-600">${item.price}</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      {item.rating > 0 && (
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-gray-700">{item.rating}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex items-center text-xs text-gray-500 mb-4">
                      <span className="bg-gray-100 px-2 py-1 rounded">{item.category}</span>
                      {item.preparationTime && (
                        <span className="ml-2">{item.preparationTime} min</span>
                      )}
                    </div>

                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {item.tags.map(tag => (
                          <span key={tag} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center justify-center space-x-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredMeals.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🍽️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No items yet</h3>
                <p className="text-gray-600 mb-6">
                  Start by adding your first item for {timeSlots.find(slot => slot.key === activeTab)?.label.toLowerCase()}
                </p>
                <button
                  onClick={() => setIsAddingItem(true)}
                  className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                >
                  Add Your First Item
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
