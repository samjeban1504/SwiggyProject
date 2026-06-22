import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantAPI } from '../services/api';
import { BiArrowBack, BiTrash, BiRestaurant } from 'react-icons/bi';

const AdminRestaurants = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const admin = localStorage.getItem('adminUser');
    if (!admin) {
      navigate('/admin/login');
      return;
    }
    fetchRestaurants();
  }, [navigate]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const res = await restaurantAPI.getAll();
      setRestaurants(res.data);
    } catch (err) {
      setError('Failed to load restaurants');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRestaurant = async (id) => {
    if (window.confirm('Are you sure you want to delete this restaurant?')) {
      try {
        await restaurantAPI.delete(id);
        setRestaurants(restaurants.filter(r => r.id !== id));
      } catch (err) {
        setError('Failed to delete restaurant');
      }
    }
  };

  return (
    <div className="container-fluid py-5" style={{ backgroundColor: '#0d1324' }}>
      <div className="mb-4">
        <button
          className="btn btn-outline-secondary mb-3"
          onClick={() => navigate('/admin/dashboard')}
          style={{ borderRadius: '24px', borderWidth: '1.5px' }}
        >
          <BiArrowBack className="me-2" />
          Back to Dashboard
        </button>
        <h2 className="fw-bold" style={{ color: '#ffffff' }}>
          <BiRestaurant className="me-2" style={{ color: '#0dcaf0' }} />
          Manage Restaurants
        </h2>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="glass-card p-4" style={{ background: 'rgba(20, 18, 39, 0.96)' }}>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-5">
            <p style={{ color: '#ff6a00', fontWeight: 600 }}>No restaurants found</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-borderless align-middle table-quick-header">
              <thead>
                <tr>
                  <th style={{ color: '#ff6a00' }}>ID</th>
                  <th style={{ color: '#ff6a00' }}>Name</th>
                  <th style={{ color: '#ff6a00' }}>Location</th>
                  <th style={{ color: '#ff6a00' }}>Phone</th>
                  <th style={{ color: '#ff6a00' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {restaurants.map((restaurant) => (
                  <tr key={restaurant.id}>
                    <td className="fw-bold" style={{ color: '#000000' }}>{restaurant.id}</td>
                    <td className="fw-bold" style={{ minWidth: '150px', color: '#000000' }}>{restaurant.restaurantName || restaurant.name || 'N/A'}</td>
                    <td style={{ minWidth: '150px', color: '#000000' }}>{restaurant.address || restaurant.location || 'N/A'}</td>
                    <td style={{ color: '#000000' }}>{restaurant.phone || '-'}</td>
                    <td>
                      <button
                        className="btn btn-quick-action-sm"
                        onClick={() => handleDeleteRestaurant(restaurant.id)}
                      >
                        <BiTrash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRestaurants;
