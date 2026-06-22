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

        <div className="row g-4 justify-content-center mt-3">
          <div className="col-md-4 col-sm-6">
            <div className="glass-card h-100 d-flex flex-column align-items-center justify-content-between p-4">
              <div className="mb-4">
                <BiUser className="text-warning mb-3" size={54} />
                <h3 className="h4 fw-bold">Customer Portal</h3>
                <p className="text-muted small">Browse top restaurants, order delicious meals, and track your delivery live.</p>
              </div>
              <Link to="/customer/restaurants" className="btn btn-gradient w-100 mt-auto">
                Enter Customer Side
              </Link>
            </div>
          </div>

          <div className="col-md-4 col-sm-6">
            <div className="glass-card h-100 d-flex flex-column align-items-center justify-content-between p-4">
              <div className="mb-4">
                <BiRestaurant className="text-success mb-3" size={54} style={{ color: '#2ec4b6' }} />
                <h3 className="h4 fw-bold">Restaurant Portal</h3>
                <p className="text-muted small">Register your restaurant, manage your menu items, and process customer orders.</p>
              </div>
              <Link to="/restaurant/dashboard" className="btn btn-secondary-gradient w-100 mt-auto">
                Enter Kitchen Side
              </Link>
            </div>
          </div>

          <div className="col-md-4 col-sm-6">
            <div className="glass-card h-100 d-flex flex-column align-items-center justify-content-between p-4">
              <div className="mb-4">
                <BiCycling className="text-info mb-3" size={54} />
                <h3 className="h4 fw-bold">Delivery Boy Portal</h3>
                <p className="text-muted small">View active delivery assignments, navigate to customers, and update delivery status.</p>
              </div>
              <Link to="/delivery/dashboard" className="btn btn-gradient w-100 mt-auto" style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)', boxShadow: '0 4px 15px rgba(13,110,253,0.3)' }}>
                Enter Delivery Side
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
