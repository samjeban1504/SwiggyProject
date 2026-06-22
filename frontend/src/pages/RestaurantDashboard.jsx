import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { restaurantAPI, foodAPI, orderAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { BiRestaurant, BiPlus, BiPlusCircle, BiListUl, BiDish, BiShoppingBag, BiTimeFive } from 'react-icons/bi';

const RestaurantDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [activeRestaurantId, setActiveRestaurantId] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Validation helpers
  const isValidPhone = (phone) => /^\d{10}$/.test(phone.replace(/\D/g, ''));
  const isValidName = (name) => /^[a-zA-Z\s'-]+$/.test(name) && name.trim().length >= 2;
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
  // Registration Form
  const [showReg, setShowReg] = useState(false);
  const [name, setName] = useState('');
  const [owner, setOwner] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  // Stats for Selected Restaurant
  const [menuCount, setMenuCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [newOrderCount, setNewOrderCount] = useState(0);
  const [restaurantPendingOrders, setRestaurantPendingOrders] = useState({});

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (!activeRestaurantId) {
      setMenuCount(0);
      setOrderCount(0);
      setNewOrderCount(0);
      return;
    }
    
    // Fetch stats for active restaurant and global order alerts
    Promise.all([
      foodAPI.getByRestaurant(activeRestaurantId),
      orderAPI.getAll()
    ])
      .then(([foodsRes, ordersRes]) => {
        setMenuCount(foodsRes.data.length);
        const activeOrders = ordersRes.data.filter((o) => o.restaurantId.toString() === activeRestaurantId.toString());
        setOrderCount(activeOrders.length);
        const pendingMap = {};
        ordersRes.data.forEach((o) => {
          if (!o.foodProcess) {
            const rid = o.restaurantId.toString();
            pendingMap[rid] = (pendingMap[rid] || 0) + 1;
          }
        });
        setRestaurantPendingOrders(pendingMap);
        setNewOrderCount(activeOrders.filter((o) => !o.foodProcess).length);
      })
      .catch((err) => console.error('Error fetching stats', err));

  }, [activeRestaurantId]);

  const fetchRestaurants = (selectNewId = null) => {
    setLoading(true);
    restaurantAPI.getAll()
      .then((res) => {
        setRestaurants(res.data);
        if (res.data.length > 0) {
          setActiveRestaurantId(selectNewId || res.data[0].id.toString());
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    // Validation
    if (!name.trim() || !isValidName(name)) {
      setRegError('Restaurant name should only contain letters, spaces, hyphens, or apostrophes.');
      return;
    }
    if (!owner.trim() || !isValidName(owner)) {
      setRegError('Owner name should only contain letters, spaces, hyphens, or apostrophes.');
      return;
    }
    if (!phone.trim() || !isValidPhone(phone)) {
      setRegError('Phone number must be exactly 10 digits.');
      return;
    }
    if (!email.trim() || !isValidEmail(email)) {
      setRegError('Please enter a valid email address.');
      return;
    }
    if (!address.trim()) {
      setRegError('Address is required.');
      return;
    }

    const data = {
      restaurantName: name,
      ownerName: owner,
      phone: phone.replace(/\D/g, ''),
      email,
      address
    };

    restaurantAPI.create(data)
      .then((res) => {
        setRegSuccess('Restaurant registered successfully!');
        setName('');
        setOwner('');
        setPhone('');
        setEmail('');
        setAddress('');
        setShowReg(false);
        fetchRestaurants(res.data.id.toString());
      })
      .catch((err) => {
        console.error(err);
        setRegError('Failed to register restaurant.');
      });
  };

  const activeRes = restaurants.find((r) => r.id.toString() === activeRestaurantId.toString());

  if (loading) return <LoadingSpinner message="Opening kitchen dashboard..." />;

  return (
    <div className="container py-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-5 gap-3">
        <div>
          <h1 className="fw-bold mb-1">Kitchen <span className="gradient-text">Dashboard</span></h1>
          <p className="text-muted mb-0">Manage your menu, view active orders, and register kitchen listings.</p>
        </div>
        <button
          className="btn btn-gradient d-flex align-items-center gap-1"
          onClick={() => setShowReg(!showReg)}
        >
          <BiPlusCircle size={20} />
          <span>{showReg ? 'Show Dash' : 'Register Restaurant'}</span>
        </button>
      </div>

      <div className="row g-4">
        {/* Main Dashboard Panel */}
        {!showReg ? (
          <>
            {/* All Registered Restaurants */}
            <div className="col-12">
              <h4 className="fw-bold mb-3">📍 All Registered Restaurants</h4>
              {restaurants.length === 0 ? (
                <div className="glass-card p-5 text-center">
                  <p className="text-muted mb-0">No restaurants registered yet. Click "Register Restaurant" to get started!</p>
                </div>
              ) : (
                <div className="row g-3">
                  {restaurants.map((restaurant) => (
                    <div className="col-lg-4 col-md-6" key={restaurant.id}>
                      <div
                        className={`glass-card p-4 cursor-pointer h-100 ${
                          activeRestaurantId === restaurant.id.toString() ? 'border-warning' : ''
                        }`}
                        onClick={() => setActiveRestaurantId(restaurant.id.toString())}
                        style={{
                          cursor: 'pointer',
                          border: activeRestaurantId === restaurant.id.toString() ? '2px solid #ffc107' : '1px solid rgba(255,255,255,0.1)',
                          transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                      >
                        <div className="d-flex align-items-start justify-content-between mb-3">
                          <div>
                            <h5 className="fw-bold mb-1">{restaurant.restaurantName}</h5>
                            <p className="text-muted small mb-0">Owner: {restaurant.ownerName}</p>
                          </div>
                          <div className="d-flex flex-column align-items-end gap-2">
                            {restaurantPendingOrders[restaurant.id.toString()] > 0 && (
                              <span className="badge bg-danger text-white">
                                {restaurantPendingOrders[restaurant.id.toString()]} new order{restaurantPendingOrders[restaurant.id.toString()] > 1 ? 's' : ''}
                              </span>
                            )}
                            {activeRestaurantId === restaurant.id.toString() && (
                              <span className="badge bg-warning text-dark">Active</span>
                            )}
                          </div>
                        </div>
                        <p className="text-muted small mb-2">
                          <span>📍 {restaurant.address}</span>
                        </p>
                        <p className="text-muted small mb-0">
                          <span>📞 {restaurant.phone}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Restaurant Selector & Info */}
            {restaurants.length > 0 && (
              <div className="col-lg-12">
                <div className="glass-card">
                  <label className="form-label text-muted small fw-bold">Quick Select (Dropdown)</label>
                  <select
                    className="form-select glass-input"
                    value={activeRestaurantId}
                    onChange={(e) => setActiveRestaurantId(e.target.value)}
                  >
                    {restaurants.map((r) => (
                      <option key={r.id} value={r.id} style={{ backgroundColor: '#1a1c24' }}>
                        {r.restaurantName} (Owner: {r.ownerName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {activeRes && (
              <>
                {/* Stats Cards */}
                <div className="col-md-6">
                  <div className="glass-card text-center p-4">
                    <BiDish size={48} className="text-warning mb-2" />
                    <h3 className="display-6 fw-bold text-white">{menuCount}</h3>
                    <p className="text-muted mb-0">Total Menu Items</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="glass-card text-center p-4">
                    <BiShoppingBag size={48} className="text-success mb-2" style={{ color: '#2ec4b6' }} />
                    <h3 className="display-6 fw-bold text-white">{orderCount}</h3>
                    <p className="text-muted mb-0">Total Orders Received</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="glass-card text-center p-4">
                    <BiTimeFive size={48} className="text-danger mb-2" />
                    <h3 className="display-6 fw-bold text-white">{newOrderCount}</h3>
                    <p className="text-muted mb-0">Pending New Orders</p>
                  </div>
                </div>

                {/* Operations links */}
                <div className="col-lg-6">
                  <div className="glass-card h-100 d-flex flex-column justify-content-between">
                    <div>
                      <h4 className="fw-bold mb-2">Menu Management</h4>
                      <p className="text-muted small">Add new dishes, update pricing, descriptions, stock availability, or delete old menu items.</p>
                    </div>
                    <Link to={`/restaurant/menu/${activeRestaurantId}`} className="btn btn-gradient w-100 mt-4 d-flex align-items-center justify-content-center gap-1">
                      <BiPlus size={20} />
                      <span>Manage Food Items</span>
                    </Link>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="glass-card h-100 d-flex flex-column justify-content-between">
                    <div>
                      <h4 className="fw-bold mb-2">Order Processing</h4>
                      <p className="text-muted small">View incoming customer requests, click process button to notify delivery partners, and monitor fulfillment status.</p>
                    </div>
                    <Link to={`/restaurant/orders/${activeRestaurantId}`} className="btn btn-secondary-gradient w-100 mt-4 d-flex align-items-center justify-content-center gap-1">
                      <BiListUl size={20} />
                      <span>View & Process Orders</span>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          /* Registration Form */
          <div className="col-12">
            <div className="glass-card max-width-600 mx-auto">
              <div className="text-center mb-4">
                <BiRestaurant size={48} className="text-warning mb-2" />
                <h2 className="fw-bold">Register Kitchen</h2>
                <p className="text-muted small">List your restaurant to start selling dishes.</p>
              </div>

              <form onSubmit={handleRegister} className="row g-3">
                {regError && <div className="col-12 alert alert-danger py-2">{regError}</div>}
                {regSuccess && <div className="col-12 alert alert-success py-2">{regSuccess}</div>}
                <div className="col-12">
                  <label className="form-label text-muted small fw-bold">Restaurant Name</label>
                  <input
                    type="text"
                    className="form-control glass-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Grand Plaza Kitchen"
                    required
                  />
                  <small className="text-muted">Letters, spaces, hyphens, apostrophes only</small>
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold">Owner Name</label>
                  <input
                    type="text"
                    className="form-control glass-input"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    placeholder="Alice Smith"
                    required
                  />
                  <small className="text-muted">Letters, spaces, hyphens, apostrophes only</small>
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control glass-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="9876543210"
                    maxLength="10"
                    required
                  />
                  <small className="text-muted">10-digit number only</small>
                </div>
                <div className="col-12">
                  <label className="form-label text-muted small fw-bold">Email Address</label>
                  <input
                    type="email"
                    className="form-control glass-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@grandplaza.com"
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label text-muted small fw-bold">Address</label>
                  <textarea
                    className="form-control glass-input"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Food Street, Culinary Hills"
                    rows="2"
                    required
                  ></textarea>
                </div>
                <div className="col-12 text-end">
                  <button type="submit" className="btn btn-gradient px-5 py-2">
                    Submit Registration
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDashboard;
