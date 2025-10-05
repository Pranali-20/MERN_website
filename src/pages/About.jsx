import React from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, MapPin, Zap, Heart, Award, ChefHat, Globe } from 'lucide-react';

const About = () => {
  const stats = [
    { number: '50K+', label: 'Happy Customers', icon: Users },
    { number: '8+', label: 'Years of Service', icon: Clock },
    { number: '150+', label: 'Partner Stores', icon: MapPin },
    { number: '50+', label: 'Cities Served', icon: Globe },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Every decision we make puts our customers at the center, ensuring the best breakfast experience possible.'
    },
    {
      icon: Award,
      title: 'Quality Excellence',
      description: 'We partner only with restaurants that meet our high standards for food quality and service.'
    },
    {
      icon: ChefHat,
      title: 'Local Partners',
      description: 'Supporting local businesses and bringing you authentic flavors from your neighborhood.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Constantly improving our platform to make breakfast ordering easier and more personalized.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-50 to-amber-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              About <span className="text-orange-500">breakfast4U</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to make every morning better by connecting people with perfect 
              breakfast experiences tailored to their time, location, and preferences.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="bg-white rounded-full p-4 w-20 h-20 mx-auto mb-4 shadow-lg flex items-center justify-center">
                  <stat.icon className="h-8 w-8 text-orange-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              breakfast4U was born from a simple observation: people have different breakfast needs at different times of the 
              day, and finding the right meal at the right time shouldn't be complicated.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="bg-orange-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">The Problem We Solved</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Many people struggled to find the right breakfast for their needs at different times of the day. They wanted to find 
                  appropriate breakfast options that matched their schedule and dietary preferences. Morning rush meant settling for 
                  whatever was quick, while afternoon cravings often went unsatisfied due to limited options.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  We realized that local cafés and restaurants had amazing offerings, but customers couldn't easily discover what was 
                  available when they needed it most.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="bg-amber-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">💡 The Idea</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Create a smart platform that learns when and what people want to eat, then connects them with local 
                  businesses that can satisfy those cravings perfectly.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  By understanding timing patterns, location preferences, and dietary needs, we could make breakfast discovery 
                  effortless and help local partners reach customers at the perfect moment.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core principles guide everything we do, from product development to partner relationships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-orange-100 rounded-full p-3">
                    <value.icon className="h-6 w-6 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{value.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Passionate food lovers and tech enthusiasts working together to revolutionize breakfast discovery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Chen', role: 'CEO & Founder', image: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400' },
              { name: 'Marcus Johnson', role: 'Head of Partnerships', image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400' },
              { name: 'Elena Rodriguez', role: 'Lead Developer', image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400' }
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="relative overflow-hidden rounded-xl mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Your Perfect Morning?
            </h2>
            <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
              Join thousands of breakfast lovers who've discovered their perfect morning routine with breakfast4U.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-white text-orange-500 px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors duration-200">
                Find Your Perfect Breakfast
              </button>
              <button className="border border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-orange-500 transition-colors duration-200">
                Become a Partner Store
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;