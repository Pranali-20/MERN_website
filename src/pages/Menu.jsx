import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Star, Heart, ShoppingCart, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

const Menu = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedTime, setSelectedTime] = useState('Any Time');
  const [sortBy, setSortBy] = useState('Highest Rated');
  const [storeFilter, setStoreFilter] = useState('');
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const store = urlParams.get('store');
    if (store) {
      setStoreFilter(store);
    }
  }, []);

  useEffect(() => {
    fetchMeals();
  }, [sortBy, selectedCategory, selectedTime]);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = {};
      if (selectedCategory !== 'All Categories') {
        filters.category = selectedCategory;
      }
      if (selectedTime !== 'Any Time') {
        filters.timeOfDay = selectedTime.toLowerCase();
      }
      if (sortBy) {
        filters.sortBy = sortBy;
      }

      const response = await api.getMeals(filters);
      setMeals(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load meals');
      console.error('Error fetching meals:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'All Categories',
    'Pancakes',
    'Street Food',
    'South Indian',
    'Maharashtrian',
    'Snacks',
    'Chaats',
    'Breakfast',
    'Beverages'
  ];

  const timeOptions = ['Any Time', 'Morning', 'Afternoon', 'Evening'];
  const sortOptions = ['Highest Rated', 'Price: Low to High', 'Price: High to Low', 'Most Popular'];

  const filteredItems = meals.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStore = !storeFilter || (item.store && item.store.name === storeFilter);
    return matchesSearch && matchesStore;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our <span className="text-orange-500">Menu</span>
            {storeFilter && (
              <span className="text-lg font-normal text-gray-600 block mt-2">
                Menu from: <span className="text-orange-500 font-semibold">{storeFilter}</span>
              </span>
            )}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our carefully curated selection of breakfast favorites and healthy snacks
          </p>
          {storeFilter && (
            <button
              onClick={() => {
                setStoreFilter('');
                window.history.pushState({}, '', '/menu');
              }}
              className="mt-4 text-orange-500 hover:text-orange-600 underline"
            >
              Clear filter and show all menu items
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {timeOptions.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {sortOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredItems.length} of {meals.length} items
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading meals...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
                >
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200">
                      <Heart className="h-5 w-5 text-gray-400 hover:text-red-500 transition-colors duration-200" />
                    </button>
                    <div className="absolute bottom-3 left-3 bg-white px-2 py-1 rounded-full text-xs font-medium text-orange-600">
                      ${item.price}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-500 transition-colors duration-200">
                        {item.name}
                      </h3>
                      {item.rating > 0 && (
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-gray-700">{item.rating}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-1 text-sm text-gray-500 mb-3">
                      <span>{item.preparationTime} min</span>
                      {item.reviewCount > 0 && (
                        <>
                          <span>•</span>
                          <span>({item.reviewCount} reviews)</span>
                        </>
                      )}
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>

                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {item.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {item.store && (
                      <div className="mb-3 text-xs text-gray-500">
                        Available at: <span className="font-medium text-gray-700">{item.store.name}</span>
                      </div>
                    )}

                    <button
                      onClick={() => navigate(`/stores?category=${item.category}`)}
                      className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Show Stores</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Menu;
