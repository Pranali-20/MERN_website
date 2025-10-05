import React, { useState } from 'react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, MapPin, Clock, Star, Phone, Filter, InspectionPanel as Directions } from 'lucide-react';

const Stores = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('All Areas');
  const [selectedDistance, setSelectedDistance] = useState('All Places');
  const [isOpenNow, setIsOpenNow] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');

  // Get category from URL params on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const category = urlParams.get('category');
    if (category) {
      setCategoryFilter(category);
    }
  }, [location.search]);

  const areas = ['All Areas', 'Sakhrale', 'Takari', 'Islampur', 'Walwa'];
  const distances = ['All Places', 'Within 1 mile', 'Within 3 miles', 'Within 5 miles'];

  const stores = [
    {
      id: 1,
      name: 'Shraddha Snack Centre',
      rating: 4.5,
      status: 'Open',
      distance: '0.5 miles',
      address: 'Opp Gate No 1, RIT, Sakhrale',
      hours: '6:00 AM - 3:00 PM',
      phone: '(555) 123-4567',
      area: 'Sakhrale',
      specialties: ['Healthy Options', 'Beverages', 'South Indian'],
      features: ['WiFi', 'Outdoor Seating', 'Vegan Options'],
      popularItems: ['Idli', 'Dosa', 'Coffee'],
      image: 'https://images.pexels.com/photos/887827/pexels-photo-887827.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      name: 'Prakash Snacks',
      rating: 4.8,
      status: 'Open',
      distance: '0.7 miles',
      address: 'near Ram Mandir,Sakhrale',
      hours: '6:00 AM - 5:00 PM',
      phone: '(555) 234-5678',
      area: 'Sakhrale',
      specialties: ['Vadapav', 'Beverages', 'Fast Food'],
      features: ['Takeout', 'Family-Friendly', 'Fresh Baked Daily'],
      popularItems: ['Dabeli', 'Chai', 'Samosa'],
      image: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 3,
      name: 'Tuljai Snacks',
      rating: 4.6,
      status: 'Opened',
      distance: '0.9 miles',
      address: 'near Bus Stand,Takari',
      hours: '5:30 AM - 10:00 PM',
      phone: '(555) 345-6789',
      area: 'Takari',
      specialties: ['Pav Bhaji', 'Kolhapuri Misal', 'Poha'],
      features: ['Authentic French', 'Takeout', 'Desserts'],
      popularItems: ['Patties', 'French Fries', 'Pav Bhaji'],
      image: 'Tuljai.jpg'
    },
    {
      id: 4,
      name: 'Mugdha Snacks',
      rating: 4.7,
      status: 'Open',
      distance: '1.2 miles',
      address: 'Gandhi Chowk, Islampur',
      hours: '7:00 AM - 9:00 PM',
      phone: '(555) 456-7890',
      area: 'Islampur',
      specialties: ['Sweets ', 'Dhokla', 'Vegan Options'],
      features: ['Organic', 'Gluten-Free', 'Sustainable Atmosphere'],
      popularItems: ['Sugercane juice', 'Sprout Chaat', 'Roasted Corn'],
      image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 5,
      name: 'Anil snacks',
      rating: 4.3,
      status: 'Open',
      distance: '1.5 miles',
      address: 'Station Road, Walwa',
      hours: '5:00 AM - 2:00 PM',
      phone: '(555) 567-8901',
      area: 'Walwa',
      specialties: ['Light Food', 'Indian Classic', 'Milkshakes'],
      features: ['Diner Style', 'Large Portions', 'Classic Menu'],
      popularItems: ['Upma', 'Bhel Puri', 'Pakoras'],
      image: 'https://images.pexels.com/photos/6267/menu-restaurant-vintage-table.jpg?auto=compress&cs=tinysrgb&w=400'
    },
   
  ];

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.specialties.some(specialty => 
                           specialty.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesArea = selectedArea === 'All Areas' || store.area === selectedArea;
    const matchesStatus = !isOpenNow || store.status === 'Open';
    const matchesCategory = !categoryFilter || 
      store.specialties.some(specialty => 
        specialty.toLowerCase().includes(categoryFilter.toLowerCase())
      ) ||
      // Also match by category mapping
      (categoryFilter === 'South Indian' && store.specialties.some(s => s.includes('South Indian'))) ||
      (categoryFilter === 'Street Food' && store.specialties.some(s => s.includes('Fast Food') || s.includes('Vadapav'))) ||
      (categoryFilter === 'Maharashtrian' && store.specialties.some(s => s.includes('Kolhapuri Misal') || s.includes('Poha'))) ||
      (categoryFilter === 'Snacks' && store.specialties.some(s => s.includes('Beverages') || s.includes('Fast Food'))) ||
      (categoryFilter === 'Beverages' && store.specialties.some(s => s.includes('Beverages')));
    
    return matchesSearch && matchesArea && matchesStatus && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
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

            {/* Area Filter */}
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {areas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>

            {/* Distance Filter */}
            <select
              value={selectedDistance}
              onChange={(e) => setSelectedDistance(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {distances.map(distance => (
                <option key={distance} value={distance}>{distance}</option>
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

        {/* Store Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredStores.map((store, index) => (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="md:flex">
                <div className="md:w-48 md:flex-shrink-0">
                  <img
                    src={store.image}
                    alt={store.name}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{store.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-gray-700">{store.rating}</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          store.status === 'Open' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {store.status}
                        </span>
                        <span className="text-sm text-gray-500">• {store.distance}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{store.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 flex-shrink-0" />
                      <span>{store.hours}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 flex-shrink-0" />
                      <span>{store.phone}</span>
                    </div>
                  </div>

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

                  <div className="mb-6">
                    <p className="text-xs font-medium text-gray-700 mb-2">Popular Items:</p>
                    <div className="text-sm text-gray-600">
                      {store.popularItems.join(' • ')}
                    </div>
                  </div>

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
      </div>
    </div>
  );
};

export default Stores;