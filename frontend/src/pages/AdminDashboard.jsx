import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI, restaurantAPI, foodAPI, orderAPI, deliveryBoyAPI, adminAPI } from '../services/api';
import { BiLogOutCircle, BiUser, BiRestaurant, BiBox, BiCycling, BiBarChartAlt2 } from 'react-icons/bi';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRestaurants: 0,
    totalOrders: 0,
    totalDeliveryBoys: 0,
    totalFood: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const admin = localStorage.getItem('adminUser');
    if (!admin) {
      navigate('/admin/login');
      return;
    }
    setAdminUser(JSON.parse(admin));
    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const [usersRes, restaurantsRes, ordersRes, deliveryBoysRes, foodRes] = await Promise.all([
        userAPI.getAll(),
        restaurantAPI.getAll(),
        orderAPI.getAll(),
        deliveryBoyAPI.getAll(),
        foodAPI.getAll(),
      ]);

      setStats({
        totalUsers: usersRes.data.length,
        totalRestaurants: restaurantsRes.data.length,
        totalOrders: ordersRes.data.length,
        totalDeliveryBoys: deliveryBoysRes.data.length,
        totalFood: foodRes.data.length,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const StatCard = ({ icon: Icon, label, value, onClick }) => (
    <div
      className="glass-card p-4 cursor-pointer"
      onClick={onClick}
      style={{ cursor: 'pointer', transition: 'all 0.3s' }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      <div className="d-flex align-items-center mb-2">
        <Icon size={28} className="text-danger me-3" />
        <h6 className="mb-0 text-muted">{label}</h6>
      </div>
      <h2 className="fw-bold mt-3">{loading ? '...' : value}</h2>
    </div>
  );

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4 align-items-center">
        <div className="col">
          <h2 className="fw-bold mb-2">
            <BiBarChartAlt2 className="me-2 text-danger" />
            Admin Dashboard
          </h2>
          <p className="text-muted mb-0">Welcome, {adminUser?.username} 👋</p>
        </div>
        <div className="col-auto">
          <button
            className="btn btn-outline-danger"
            onClick={handleLogout}
          >
            <BiLogOutCircle size={20} className="me-2" />
            Logout
          </button>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-6 col-lg-3">
          <StatCard
            icon={BiUser}
            label="Total Customers"
            value={stats.totalUsers}
            onClick={() => navigate('/admin/users')}
          />
        </div>
        <div className="col-md-6 col-lg-3">
          <StatCard
            icon={BiRestaurant}
            label="Total Restaurants"
            value={stats.totalRestaurants}
            onClick={() => navigate('/admin/restaurants')}
          />
        </div>
        <div className="col-md-6 col-lg-3">
          <StatCard
            icon={BiBox}
            label="Total Orders"
            value={stats.totalOrders}
            onClick={() => navigate('/admin/orders')}
          />
        </div>
        <div className="col-md-6 col-lg-3">
          <StatCard
            icon={BiCycling}
            label="Delivery Partners"
            value={stats.totalDeliveryBoys}
            onClick={() => navigate('/admin/delivery-boys')}
          />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="glass-card p-4">
            <h5 className="fw-bold mb-3">Quick Actions</h5>
            <div className="d-grid gap-2">
              <button
                className="btn py-3 fw-semibold"
                onClick={() => navigate('/admin/users')}
                style={{
                  background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                  color: '#1a0a00',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  letterSpacing: '0.02em',
                  boxShadow: '0 4px 15px rgba(249, 115, 22, 0.35)',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(249, 115, 22, 0.55)'; e.currentTarget.style.filter = 'brightness(1.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(249, 115, 22, 0.35)'; e.currentTarget.style.filter = 'brightness(1)'; }}
              >
                <BiUser className="me-2" />
                Manage Customers
              </button>
              <button
                className="btn py-3 fw-semibold"
                onClick={() => navigate('/admin/restaurants')}
                style={{
                  background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                  color: '#1a0a00',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  letterSpacing: '0.02em',
                  boxShadow: '0 4px 15px rgba(249, 115, 22, 0.35)',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(249, 115, 22, 0.55)'; e.currentTarget.style.filter = 'brightness(1.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(249, 115, 22, 0.35)'; e.currentTarget.style.filter = 'brightness(1)'; }}
              >
                <BiRestaurant className="me-2" />
                Manage Restaurants
              </button>
              <button
                className="btn py-3 fw-semibold"
                onClick={() => navigate('/admin/orders')}
                style={{
                  background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                  color: '#1a0a00',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  letterSpacing: '0.02em',
                  boxShadow: '0 4px 15px rgba(249, 115, 22, 0.35)',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(249, 115, 22, 0.55)'; e.currentTarget.style.filter = 'brightness(1.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(249, 115, 22, 0.35)'; e.currentTarget.style.filter = 'brightness(1)'; }}
              >
                <BiBox className="me-2" />
                View All Orders
              </button>
              <button
                className="btn py-3 fw-semibold"
                onClick={() => navigate('/admin/delivery-boys')}
                style={{
                  background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                  color: '#1a0a00',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  letterSpacing: '0.02em',
                  boxShadow: '0 4px 15px rgba(249, 115, 22, 0.35)',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(249, 115, 22, 0.55)'; e.currentTarget.style.filter = 'brightness(1.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(249, 115, 22, 0.35)'; e.currentTarget.style.filter = 'brightness(1)'; }}
              >
                <BiCycling className="me-2" />
                Manage Delivery Partners
              </button>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="glass-card p-4">
            <h5 className="fw-bold mb-3">System Information</h5>
            <div className="row g-3">
              <div className="col-6">
                <div className="p-3 rounded" style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)', border: '1px solid rgba(220, 53, 69, 0.3)' }}>
                  <p className="small mb-1" style={{ color: '#ff6b6b' }}>Active Users</p>
                  <h4 className="fw-bold text-danger">{stats.totalUsers}</h4>
                </div>
              </div>
              <div className="col-6">
                <div className="p-3 rounded" style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)', border: '1px solid rgba(220, 53, 69, 0.3)' }}>
                  <p className="small mb-1" style={{ color: '#ff6b6b' }}>Active Restaurants</p>
                  <h4 className="fw-bold text-danger">{stats.totalRestaurants}</h4>
                </div>
              </div>
              <div className="col-6">
                <div className="p-3 rounded" style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)', border: '1px solid rgba(220, 53, 69, 0.3)' }}>
                  <p className="small mb-1" style={{ color: '#ff6b6b' }}>Food Items</p>
                  <h4 className="fw-bold text-danger">{stats.totalFood}</h4>
                </div>
              </div>
              <div className="col-6">
                <div className="p-3 rounded" style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)', border: '1px solid rgba(220, 53, 69, 0.3)' }}>
                  <p className="small mb-1" style={{ color: '#ff6b6b' }}>Total Orders</p>
                  <h4 className="fw-bold text-danger">{stats.totalOrders}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;