import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Stores from './pages/Stores';
import About from './pages/About';
import Contact from './pages/Contact';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import OwnerDashboard from './pages/OwnerDashboard';
import { useEffect, useState } from 'react';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
          <Route path="/*" element={
            <>
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/stores" element={<Stores />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;