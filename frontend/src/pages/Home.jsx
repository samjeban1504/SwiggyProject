import React from 'react';
import { Link } from 'react-router-dom';
import { BiUser, BiRestaurant, BiCycling } from 'react-icons/bi';
import { SiSwiggy } from 'react-icons/si';

const Home = () => {
  return (
    <div className="home-hero" style={{ backgroundImage: "url('/home-bg.webp')" }}>
      <div className="hero-content text-center">
        <SiSwiggy className="text-warning mb-3" size={72} style={{ filter: 'drop-shadow(0 0 24px rgba(255, 193, 7, 0.45))' }} />
        <h1 className="display-4 fw-extrabold mb-3">
          Welcome to <span className="gradient-text">Swiggy</span>
        </h1>
        <p className="lead text-muted fs-4 mb-4">
          Order food from the best restaurants near you. Fast delivery, real-time tracking.
        </p>

        <div className="mt-5">
          <Link to="/customer/restaurants" className="btn btn-gradient px-5 py-3 fs-5 fw-bold" style={{ borderRadius: '30px' }}>
            Explore Restaurants
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
