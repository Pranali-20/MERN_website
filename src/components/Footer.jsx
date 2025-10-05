import React from 'react';
import { Clock, MapPin, Phone, Mail, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-amber-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-orange-500 p-2 rounded-full">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">breakfast4U</span>
            </div>
            <p className="text-amber-200 text-sm leading-relaxed mb-4">
              Connecting you with the perfect breakfast and snacks, tailored to your time and location. Fresh, fast, and always delicious.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-amber-200 hover:text-white cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-amber-200 hover:text-white cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-amber-200 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-amber-200">
              <li><a href="#" className="hover:text-white transition-colors">Morning Menu</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Afternoon Snacks</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Evening Delights</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Find Stores</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Partner With Us</a></li>
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Service Areas</h3>
            <ul className="space-y-2 text-amber-200">
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Sakhrale</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Takari</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Islampur</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Walwa</span>
              </li>
              <li><a href="#" className="text-orange-400 hover:text-orange-300 transition-colors">View All Areas</a></li>
            </ul>
          </div>

          {/* Get in Touch */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
            <div className="space-y-3 text-amber-200">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>(555) 123-FOOD</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>hello@breakfast4u.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Support Hours</span>
              </div>
              <p className="text-sm text-amber-300">Mon-Sun: 6:00 AM - 10:00 PM</p>
            </div>
          </div>
        </div>

        <div className="border-t border-amber-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-amber-200 text-sm">
            © 2024 breakfast4U. All rights reserved. Made with ❤️ for food lovers.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="text-amber-200 hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-amber-200 hover:text-white text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-amber-200 hover:text-white text-sm transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;