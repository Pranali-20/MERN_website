import React, { useState } from 'react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Star, Heart, ShoppingCart } from 'lucide-react';

const Menu = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedTime, setSelectedTime] = useState('Any Time');
  const [sortBy, setSortBy] = useState('Highest Rated');
  const [storeFilter, setStoreFilter] = useState('');

  // Get store from URL params on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const store = urlParams.get('store');
    if (store) {
      setStoreFilter(store);
    }
  }, []);

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

  const menuItems = [
    {
  id: 1,
  name: 'Bhel Puri',
  image: 'Bhelpuri.webp?auto=compress&cs=tinysrgb&w=400',
  description: 'Crispy puffed rice tossed with tangy chutneys, onions, tomatoes, and crunchy sev',
  price: 30,
  rating: 4.3,
  reviews: 210,
  tags: ['Vegan'],
  category: 'Snacks',
  time: 10,
  availableAt: ['Shraddha Snack Centre', 'Prakash Snacks']
},
{
  id: 2,
  name: 'Pav Bhaji',
  image: 'Pavbhaji.jpg?auto=compress&cs=tinysrgb&w=400',
  description: 'Buttery pav buns served with spicy mashed vegetable curry topped with onions and lemon',
  price: 60,
  rating: 4.6,
  reviews: 340,
  tags: ['Vegetarian'],
  category: 'Street Food',
  time: 20,
  availableAt: ['Tuljai Snacks', 'Prakash Snacks']
},
{
  id: 3,
  name: 'Idli',
  image: 'idli.jpg?auto=compress&cs=tinysrgb&w=400',
  description: 'Soft, fluffy steamed rice cakes served with coconut chutney and sambar',
  price: 30,
  rating: 4.4,
  reviews: 180,
  tags: ['Vegetarian', 'Gluten-Free'],
  category: 'South Indian',
  time: 12,
  availableAt: ['Shraddha Snack Centre']
},
{
  id: 4,
  name: 'Dosa',
  image: 'Dosa.jpg?auto=compress&cs=tinysrgb&w=400',
  description: 'Crispy golden rice crepe served with potato filling, chutneys, and sambar',
  price: 50,
  rating: 4.7,
  reviews: 260,
  tags: ['Vegetarian'],
  category: 'South Indian',
  time: 18,
  availableAt: ['Shraddha Snack Centre']
},
{
  id: 5,
  name: 'Misal Pav',
  image: 'Misal Pav.webp?auto=compress&cs=tinysrgb&w=400',
  description: 'Spicy sprouted bean curry topped with farsan, onions, and served with pav',
  price: 45,
  rating: 4.5,
  reviews: 220,
  tags: ['Vegetarian'],
  category: 'Maharashtrian',
  time: 20,
  availableAt: ['Tuljai Snacks']
},
{
  id: 6,
  name: 'Samosa',
  image: 'Samosa.jpg?auto=compress&cs=tinysrgb&w=400',
  description: 'Golden fried pastry stuffed with spiced potato and peas, served with chutney',
  price: 15,
  rating: 4.6,
  reviews: 300,
  tags: ['Vegetarian'],
  category: 'Snacks',
  time: 8,
  availableAt: ['Prakash Snacks', 'Shraddha Snack Centre']
},
{
  id: 7,
  name: 'Sprout Chaat',
  image: 'Sprout Chaat.jpg?auto=compress&cs=tinysrgb&w=400',
  description: 'Nutritious sprouted lentils tossed with tangy chutneys, onions, tomatoes, and spices',
  price: 30,
  rating: 4.2,
  reviews: 140,
  tags: ['Vegan', 'Healthy'],
  category: 'Chaats',
  time: 12,
  availableAt: ['Mugdha Snacks']
},
{
  id: 8,
  name: 'Chai',
  image: 'Chai.jpg?auto=compress&cs=tinysrgb&w=400',
  description: 'Strong Indian tea brewed with milk, sugar, and aromatic spices',
  price: 10,
  rating: 4.8,
  reviews: 500,
  tags: ['Vegetarian', 'Gluten-Free'],
  category: 'Beverages',
  time: 7,
  availableAt: ['Shraddha Snack Centre', 'Prakash Snacks', 'Tuljai Snacks']
},
{
  id: 9,
  name: 'Vada Pav',
  image: 'Vadapav.jpg?auto=compress&cs=tinysrgb&w=400',
  description: 'Spicy potato fritter sandwiched in pav bread with chutneys',
  price: 15,
  rating: 4.7,
  reviews: 400,
  tags: ['Vegetarian'],
  category: 'Street Food',
  time: 10,
  availableAt: ['Prakash Snacks', 'Tuljai Snacks']
},
{
  id: 10,
  name: 'Coffee',
  image: 'Coffee.jpg?auto=compress&cs=tinysrgb&w=400',
  description: 'Rich, aromatic brewed coffee served hot or cold',
  price: 20,
  rating: 4.6,
  reviews: 350,
  tags: ['Vegetarian'],
  category: 'Beverages',
  time: 5,
  availableAt: ['Shraddha Snack Centre', 'Anil snacks']
},
{
  id: 11,
  name: 'Milkshake',
  image: 'Milkshake.jpg?auto=compress&cs=tinysrgb&w=400',
  description: 'Creamy chilled milk blended with ice cream and choice of flavors',
  price: 60,
  rating: 4.5,
  reviews: 230,
  tags: ['Vegetarian'],
  category: 'Beverages',
  time: 8,
  availableAt: ['Anil snacks']
},
{
  id: 12,
  name: 'Omelette',
  image: 'Omlette.jpg?auto=compress&cs=tinysrgb&w=400',
  description: 'Fluffy egg omelette cooked with onions, tomatoes, and spices',
  price: 25,
  rating: 4.4,
  reviews: 190,
  tags: ['Protein-Rich'],
  category: 'Breakfast',
  time: 10,
  availableAt: ['Shraddha Snack Centre']
},
{
  id: 13,
  name: 'Poha',
  image: 'Poha.jpg?auto=compress&cs=tinysrgb&w=400',
  description: 'Flattened rice cooked with onions, green chilies, turmeric, and garnished with coriander',
  price: 15,
  rating: 4.3,
  reviews: 160,
  tags: ['Vegetarian'],
  category: 'Maharashtrian',
  time: 12,
  availableAt: ['Tuljai Snacks']
},
{
  id: 14,
  name: 'Upma',
  image: 'Upma.jpg?auto=compress&cs=tinysrgb&w=400',
  description: 'Savory semolina porridge cooked with vegetables, curry leaves, and spices',
  price: 20,
  rating: 4.2,
  reviews: 150,
  tags: ['Vegetarian'],
  category: 'South Indian',
  time: 15,
  availableAt: ['Shraddha Snack Centre']
}

  ];

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory;
    const matchesStore = !storeFilter || item.availableAt?.includes(storeFilter);
    return matchesSearch && matchesCategory && matchesStore;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
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

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Time Filter */}
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {timeOptions.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>

            {/* Sort Filter */}
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
            Showing {filteredItems.length} of {menuItems.length} items
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
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
                  ₹{item.price}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-500 transition-colors duration-200">
                    {item.name}
                  </h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-700">{item.rating}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1 text-sm text-gray-500 mb-3">
                  <span>⏱️ {item.time} min</span>
                  <span>•</span>
                  <span>({item.reviews} reviews)</span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>

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
      </div>
    </div>
  );
};

export default Menu;