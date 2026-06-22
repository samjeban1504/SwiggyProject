import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { foodAPI } from '../services/api';
import { BiArrowBack, BiTrash } from 'react-icons/bi';

const AdminFood = () => {
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const admin = localStorage.getItem('adminUser');
    if (!admin) {
      navigate('/admin/login');
      return;
    }
    fetchFoods();
  }, [navigate]);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const res = await foodAPI.getAll();
      setFoods(res.data);
    } catch (err) {
      setError('Failed to load food items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFood = async (id) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      try {
        await foodAPI.delete(id);
        setFoods(foods.filter(f => f.id !== id));
      } catch (err) {
        setError('Failed to delete food item');
      }
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <button
          className="btn btn-outline-secondary mb-3"
          onClick={() => navigate('/admin/dashboard')}
        >
          <BiArrowBack className="me-2" />
          Back to Dashboard
        </button>
        <h2 className="fw-bold" style={{ color: '#e83e8c' }}>🍽️ Manage Food Items</h2>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="glass-card p-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-pink" role="status" style={{ color: '#e83e8c' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : foods.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <p>No food items found</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead style={{ backgroundColor: 'rgba(232, 62, 140, 0.15)', borderBottom: '2px solid rgba(232, 62, 140, 0.3)' }}>
                <tr>
                  <th style={{ color: '#e83e8c' }}>ID</th>
                  <th style={{ color: '#e83e8c' }}>Name</th>
                  <th style={{ color: '#e83e8c' }}>Restaurant ID</th>
                  <th style={{ color: '#e83e8c' }}>Price</th>
                  <th style={{ color: '#e83e8c' }}>Rating</th>
                  <th style={{ color: '#e83e8c' }}>Available</th>
                  <th style={{ color: '#e83e8c' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {foods.map((food) => (
                  <tr key={food.id} style={{ borderBottom: '1px solid rgba(232, 62, 140, 0.1)' }}>
                    <td className="fw-bold" style={{ color: '#e83e8c' }}>{food.id}</td>
                    <td>{food.name}</td>
                    <td>{food.restaurantId}</td>
                    <td>₹{food.price?.toFixed(2) || '0.00'}</td>
                    <td>
                      <span className="badge bg-warning text-dark">
                        ⭐ {food.rating || '0'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${food.available ? 'bg-success' : 'bg-secondary'}`}>
                        {food.available ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm"
                        style={{ backgroundColor: 'rgba(232, 62, 140, 0.2)', color: '#e83e8c', border: '1px solid #e83e8c' }}
                        onClick={() => handleDeleteFood(food.id)}
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

export default AdminFood;
