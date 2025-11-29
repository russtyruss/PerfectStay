import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ClipboardList, DollarSign, ShieldCheck } from 'lucide-react';
import './Landing.css';

//used url because photos saved are blurry
const hotelPhoto = 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8bHV4dXJ5JTIwaG90ZWwlMjBwb29sfGVufDB8fHx8fDE3NjQzMTM0MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080';
const Landing = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();
  // Always clear session when opening landing
  useEffect(() => {
    sessionStorage.clear();
  }, []);

  // Handle browser back/forward cache restore
  useEffect(() => {
    const handlePageShow = (event) => {
      if (event.persisted) {
        sessionStorage.clear();
        navigate("/login", { replace: true });
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [navigate]);


  useEffect(() => {
    setIsVisible(true);
    const cardsTimer = setTimeout(() => {
      setCardsVisible(true);
    }, 300);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(cardsTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);



  return (
    <div className="landing-container">
      {/* Hero Section */}
      <div className="landing-hero" style={{ backgroundImage: `url(${hotelPhoto})`, backgroundPositionY: `${scrollY * 0.5}px` }}>
        <div className="hero-overlay"></div>
        <div className={`hero-content ${isVisible ? 'fade-in' : ''}`}>
          <h1>Find Your Perfect Stay</h1>
          <p>Book unique accommodations and experiences around the world</p>
          <div className="hero-buttons">
            <Link to="/login" className="btn btn-primary">
              <Search size={18} strokeWidth={2.5} /> Find Hotels
            </Link>
            <Link to="/become-host" className="btn btn-secondary">
              <ClipboardList size={18} strokeWidth={2.5} /> Become a Host
            </Link>
          </div>
        </div>
      </div>


      {/* Features*/}
      <div className="features-section">
        <div className="section-header">
          <h2>Why Choose <span style={{ color: '#3b82f6' }}>Perfect</span><span style={{ color: '#1f2937' }}>Stay</span>?</h2>
          <p>Experience the best in hospitality</p>
        </div>
        <div className={`features-grid ${cardsVisible ? 'fade-in' : ''}`}>
          <div className="feature-card">
            <div className="feature-icon search-icon">
              <Search size={32} />
            </div>
            <h3>Easy Search</h3>
            <p>Find the perfect hotel with our advanced search filters and real-time availability</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon price-icon">
              <DollarSign size={32} />
            </div>
            <h3>Best Prices</h3>
            <p>Get the best deals on hotels worldwide with our price match guarantee</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon secure-icon">
              <ShieldCheck size={32} />
            </div>
            <h3>Secure Booking</h3>
            <p>Your safety is our priority. All bookings are secured with industry-standard encryption</p>
          </div>
        </div>
      </div>

      {
        
      }
      <div className="cta-section">
        <h2>Ready to Start Hosting?</h2>
        <p>Join thousands of hosts who are earning extra income by listing their properties on PerfectStay</p>
        <Link to="/login" className="btn btn-cta">
          Get Started Today
        </Link>
      </div>
    </div>
  );
};

export default Landing;
