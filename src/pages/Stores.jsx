import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, MapPin, Clock, Star, Phone, AlertCircle, InspectionPanel as Directions } from 'lucide-react';
import { api } from '../services/api';

const Stores = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('All Areas');
  const [isOpenNow, setIsOpenNow] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const category = urlParams.get('category');
    if (category) {
      setCategoryFilter(category);
    }
  }, [location.search]);

  useEffect(() => {
    fetchStores();
  }, [selectedArea, isOpenNow]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = {};
      if (selectedArea !== 'All Areas') {
        filters.area = selectedArea;
      }
      if (isOpenNow) {
        filters.openNow = 'true';
      }

      const response = await api.getStores(filters);
      setStores(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load stores');
      console.error('Error fetching stores:', err);
    } finally {
      setLoading(false);
    }
  };

  const areas = ['All Areas', 'Sakhrale', 'Takari', 'Islampur', 'Walwa'];

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.specialties?.some(specialty =>
                           specialty.toLowerCase().includes(searchTerm.toLowerCase())
                         ) ||
                         store.address?.street?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !categoryFilter ||
      store.specialties?.some(specialty =>
        specialty.toLowerCase().includes(categoryFilter.toLowerCase())
      );

    return matchesSearch && matchesCategory;
  });

  const getStoreHours = (store) => {
    if (!store.hours) return 'Hours not available';
    const today = new Date().toLocaleLowerCase().substring(0, 3);
    const todayHours = store.hours[today];
    if (!todayHours || todayHours.closed) return 'Closed today';
    return `${todayHours.open} - ${todayHours.close}`;
  };

  const formatAddress = (address) => {
    if (!address) return 'Address not available';
    return `${address.street}, ${address.area}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find <span className="text-orange-500">Stores</span>
            {categoryFilter && (
              <span className="text-lg font-normal text-gray-600 block mt-2">
                Showing stores for: <span className="text-orange-500 font-semibold">{categoryFilter}</span>
              </span>
            )}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover breakfast4U partner locations near you with real-time availability
          </p>
          {categoryFilter && (
            <button
              onClick={() => {
                setCategoryFilter('');
                navigate('/stores');
              }}
              className="mt-4 text-orange-500 hover:text-orange-600 underline"
            >
              Clear filter and show all stores
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search stores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {areas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isOpenNow}
                onChange={(e) => setIsOpenNow(e.target.checked)}
                className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm font-medium text-gray-700">Open Now</span>
            </label>
            <div className="text-sm text-gray-600">
              Found {filteredStores.length} stores near you
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading stores...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredStores.map((store, index) => (
                <motion.div
                  key={store._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  <div className="md:flex">
                    <div className="md:w-48 md:flex-shrink-0">
                      <img
                        src={store.images && store.images[0] ? store.images[0] : 'https://images.pexels.com/photos/887827/pexels-photo-887827.jpeg?auto=compress&cs=tinysrgb&w=400'}
                        alt={store.name}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>

                    <div className="p-6 flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{store.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            {store.rating > 0 && (
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-sm font-medium text-gray-700">{store.rating}</span>
                              </div>
                            )}
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              store.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {store.isActive ? 'Open' : 'Closed'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-start space-x-2">
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{formatAddress(store.address)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 flex-shrink-0" />
                          <span>{getStoreHours(store)}</span>
                        </div>
                        {store.phone && (
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 flex-shrink-0" />
                            <span>{store.phone}</span>
                          </div>
                        )}
                      </div>

                      {store.specialties && store.specialties.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-medium text-gray-700 mb-2">Specialties:</p>
                          <div className="flex flex-wrap gap-1">
                            {store.specialties.map((specialty, idx) => (
                              <span key={idx} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {store.features && store.features.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-medium text-gray-700 mb-2">Features:</p>
                          <div className="flex flex-wrap gap-1">
                            {store.features.map((feature, idx) => (
                              <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-3">
                        <button
                          onClick={() => navigate(`/menu?store=${store.name}`)}
                          className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors duration-200"
                        >
                          View Menu
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-1">
                          <Directions className="h-4 w-4" />
                          <span>Directions</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredStores.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🏪</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No stores found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Stores;
