import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { BiCart, BiRestaurant, BiCycling, BiUser, BiShieldAlt } from 'react-icons/bi';
import { SiSwiggy } from 'react-icons/si';

const Navbar = ({ cartCount = 0 }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark glass-nav sticky-top py-3">
      <div className="container d-flex align-items-center justify-content-between">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold" to="/">
          <SiSwiggy className="text-warning" size={28} />
          <span className="gradient-text" style={{ fontSize: '1.4rem' }}>Swiggy</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse flex-grow-0" id="navbarNav">
          <ul className="navbar-nav gap-3 text-center align-items-center">
            <li className="nav-item">
              <NavLink to="/customer/profile" className={({ isActive }) => `nav-link nav-link-custom d-flex align-items-center gap-1 ${isActive ? 'active' : ''}`}>
                <BiUser size={18} />
                <span>Customer Profile</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/restaurant/dashboard" className={({ isActive }) => `nav-link nav-link-custom d-flex align-items-center gap-1 ${isActive ? 'active' : ''}`}>
                <BiRestaurant size={18} />
                <span>Restaurant Portal</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/delivery/login" className={({ isActive }) => `nav-link nav-link-custom d-flex align-items-center gap-1 ${isActive ? 'active' : ''}`}>
                <BiCycling size={18} />
                <span>Delivery Portal</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/admin/login" className={({ isActive }) => `nav-link nav-link-custom d-flex align-items-center gap-1 ${isActive ? 'active' : ''}`}>
                <BiShieldAlt size={18} />
                <span>Admin</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/customer/cart" className={({ isActive }) => `btn position-relative nav-link nav-link-custom ${isActive ? 'active' : ''}`}>
                <BiCart size={24} className="text-warning" />
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.75rem' }}>
                    {cartCount}
                  </span>
                )}
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
