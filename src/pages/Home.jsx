import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Clock, Star, Users } from 'lucide-react';

const Home = () => {
  const stats = [
    { number: '500+', label: 'Breakfast Options', icon: Users },
    { number: '150+', label: 'Partner Stores', icon: MapPin },
    { number: '50+', label: 'Specialties', icon: Star },
  ];

  // State for filters
  const [activeTime, setActiveTime] = useState("Morning");
  const [activeLocation, setActiveLocation] = useState("Sakhrale");

  // Food data by time
  const foodItems = {
  Morning: [
    { 
      image: 'idli.jpg?auto=compress&cs=tinysrgb&w=400', 
      title: 'Idli' 
    },
    { 
      image: 'Dosa.jpg?auto=compress&cs=tinysrgb&w=400', 
      title: 'Dosa' 
    },
   
    { 
      image: 'Omlette.jpg?auto=compress&cs=tinysrgb&w=400', 
      title: 'Omelette' 
    },
    { 
      image: 'Chai.jpg?auto=compress&cs=tinysrgb&w=400', 
      title: 'Chai' 
    },
    { 
      image: 'Poha.jpg?auto=compress&cs=tinysrgb&w=400', 
      title: 'Poha' 
    },
    { 
      image: 'Upma.jpg?auto=compress&cs=tinysrgb&w=400', 
      title: 'Upma' 
    }
  ],
  Afternoon: [
    { 
      image: 'Pavbhaji.jpg?auto=compress&cs=tinysrgb&w=400', 
      title: 'Pav Bhaji' 
    },
    { 
      image: 'Misal Pav.webp?auto=compress&cs=tinysrgb&w=400', 
      title: 'Misal Pav' 
    },
    { 
      image: 'Samosa.jpg?auto=compress&cs=tinysrgb&w=400', 
      title: 'Samosa' 
    },
    { 
      image: 'Sprout Chaat.jpg?auto=compress&cs=tinysrgb&w=400', 
      title: 'Sprout Chaat' 
    }
  ],
  Evening: [
    { 
      image: 'Bhelpuri.webp?auto=compress&cs=tinysrgb&w=400', 
      title: 'Bhel Puri' 
    },
    { 
      image: 'Vadapav.jpg?auto=compress&cs=tinysrgb&w=400', 
      title: 'Vada Pav' 
    },
    { 
      image: 'Chai.jpg?auto=compress&cs=tinysrgb&w=400', 
      title: 'Chai' 
    },
    { 
      image: 'Coffee.jpg?auto=compress&cs=tinysrgb&w=400', 
      title: 'Coffee' 
    },
    { 
      image: 'Milkshake.jpg?auto=compress&cs=tinysrgb&w=400', 
      title: 'Milkshake' 
    }
  ]
};


  // Store data by location
  const stores = {
    Sakhrale: [
      {
        name: 'Shraddha Snack Centre',
        rating: 4.5,
        status: 'Open',
        distance: '0.5 miles',
        address: 'Opp Gate No 1, RIT,Sakhrale',
        hours: '6:00 AM - 3:00 PM',
        specialties: ['Healthy Options', 'Beverages', 'South Indian'],
      },
      {
        name: 'Prakash Snacks',
        rating: 4.5,
        status: 'Open',
        distance: '0.5 miles',
        address: 'near Ram Mandir,Sakhrale',
        hours: '6:00 AM - 5:00 PM',
        specialties: ['Vadapav', 'Beverages', 'Fast Food'],
      },
    ],
    Takari: [
      {
        name: 'Tuljai Snacks',
        rating: 4.8,
        status: 'Open',
        distance: '0.7 miles',
        address: 'near Bus Stand,Takari',
        hours: '5:30 AM - 10:00 PM',
        specialties: ['Pav Bhaji', 'Kolhapuri Misal', 'Poha'],
      },
    ],
    Islampur: [
      {
        name: 'Mugdha Snacks',
        rating: 4.7,
        status: 'Open',
        distance: '1.2 miles',
        address: 'Gandhi Chowk, Islampur',
        hours: '7:00 AM - 9:00 PM',
        specialties: ['Sweets', 'Dhokla', 'Vegan Options'],
      },
    ],
    Walwa: [
      {
        name: 'Anil snacks',
        rating: 4.3,
        status: 'Open',
        distance: '2.0 miles',
        address: 'Station Road, Walwa',
        hours: '6:00 AM - 11:00 PM',
        specialties: ['Light Food ', 'Indian Classic', 'Milkshakes'],
      },
    ],
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-50 to-amber-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="flex items-center space-x-2 text-sm text-orange-600">
                <Clock className="h-4 w-4" />
                <span>Good Morning!</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900">
                breakfast<span className="text-orange-500">4U</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Discover perfect breakfast and snacks for your cravings. 
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button 
                  onClick={() => {
                    const perfectSection = document.getElementById('perfect-timing-section');
                    if (perfectSection) {
                      perfectSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="bg-orange-500 text-white px-8 py-4 rounded-full font-medium hover:bg-orange-600 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Find My Perfect Meal</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => {
                    const storesSection = document.getElementById('stores-near-you-section');
                    if (storesSection) {
                      storesSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="border border-gray-300 text-gray-700 px-8 py-4 rounded-full font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <MapPin className="h-5 w-5" />
                  <span>Explore Nearby Stores</span>
                </button>
              </div>
              <div className="grid grid-cols-3 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    className="text-center"
                  >
                    <div className="text-3xl font-bold text-orange-500">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img
                src="https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Delicious breakfast spread"
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Perfect Timing Section */}
      <section id="perfect-timing-section" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What's Perfect for <span className="text-orange-500">{activeTime.toLowerCase()}</span>?
          </h2>

          {/* Time Options */}
          <div className="flex justify-center space-x-4 mb-12">
            {["Morning", "Afternoon", "Evening"].map((time) => (
              <button
                key={time}
                onClick={() => setActiveTime(time)}
                className={`px-6 py-2 rounded-full font-medium transition-colors duration-200 ${
                  activeTime === time
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {time}
              </button>
            ))}
          </div>

          {/* Food Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {foodItems[activeTime].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="font-medium">{item.title}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stores Near You */}
      <section id="stores-near-you-section" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Stores Near <span className="text-orange-500">You</span>
          </h2>

          {/* Location Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {["Sakhrale", "Takari", "Islampur", "Walwa"].map((loc) => (
              <button
                key={loc}
                onClick={() => setActiveLocation(loc)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  activeLocation === loc
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {loc}
              </button>
            ))}
          </div>

          {/* Store Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stores[activeLocation].map((store, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{store.name}</h3>
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-700">{store.rating}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          store.status === "Open"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {store.status}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{store.distance}</span>
                </div>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{store.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{store.hours}</span>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Specialties:</p>
                  <div className="flex flex-wrap gap-1">
                    {store.specialties.map((specialty, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors duration-200">
                    View Menu
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                    Directions
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
