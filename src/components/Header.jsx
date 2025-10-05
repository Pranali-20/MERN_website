import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Menu as MenuIcon, X, Clock } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/';
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'Stores', href: '/stores' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-orange-500 p-2 rounded-full">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold">
              breakfast<span className="text-orange-500">4U</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors duration-200 hover:text-orange-500 ${
                  location.pathname === item.href
                    ? 'text-orange-500'
                    : 'text-gray-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">Welcome, {user.name}</span>
                {user.role === 'owner' && (
                  <Link
                    to="/owner-dashboard"
                    className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-600 transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-600 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-orange-600 transition-colors duration-200"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="border border-orange-500 text-orange-500 px-6 py-2 rounded-full text-sm font-medium hover:bg-orange-50 transition-colors duration-200"
                >
                  Register
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <MenuIcon className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 text-base font-medium transition-colors duration-200 hover:text-orange-500 ${
                    location.pathname === item.href
                      ? 'text-orange-500'
                      : 'text-gray-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;