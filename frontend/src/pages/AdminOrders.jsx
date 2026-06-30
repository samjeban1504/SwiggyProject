import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { BiArrowBack, BiBox } from 'react-icons/bi';
 
const thTd = {
  color: '#1a0a00',
  fontWeight: '700',
  padding: '14px 16px',
};
 
const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
 
  useEffect(() => {
    const admin = localStorage.getItem('adminUser');
    if (!admin) { navigate('/admin/login'); return; }
    fetchOrders();
  }, [navigate]);
 
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderAPI.getAll();
      setOrders(res.data);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };
 
  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };
 
  return (
    <div className="container-fluid py-5" style={{ backgroundColor: '#0f1224' }}>
      <div className="mb-5">
        <button
          className="btn btn-outline-secondary mb-3"
          onClick={() => navigate('/admin/profile')}
          style={{ borderRadius: '24px', borderWidth: '1.5px' }}
        >
          <BiArrowBack className="me-2" />
          Back to Dashboard
        </button>
        <div>
          <h1 className="fw-bold mb-2">
            Manage <span style={{ color: '#ff6a00' }}>Orders</span>
          </h1>
          <p className="text-muted mb-0">View all orders placed across the platform.</p>
        </div>
      </div>
 
      {error && <div className="alert alert-danger mb-4">{error}</div>}
 
      <div className="glass-card p-4" style={{ background: 'rgba(20, 18, 39, 0.95)' }}>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-secondary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <p>No orders found</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-borderless align-middle mb-0">
                <thead>
                  <tr style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' }}>
                    <th style={{ ...thTd, color: '#ff6a00' }}>Order ID</th>
                    <th style={{ ...thTd, color: '#ff6a00' }}>Customer Name</th>
                    <th style={{ ...thTd, color: '#ff6a00' }}>Restaurant Name</th>
                    <th style={{ ...thTd, color: '#ff6a00' }}>Total Price</th>
                    <th style={{ ...thTd, color: '#ff6a00' }}>Order Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <td className="fw-bold" style={{ color: '#000000' }}>{order.id}</td>
                      <td className="fw-bold" style={{ color: '#000000' }}>{order.customerName || order.userId || '-'}</td>
                      <td style={{ color: '#000000' }}>{order.restaurantName || order.restaurantId || '-'}</td>
                      <td style={{ color: '#000000' }}>₹{order.totalPrice?.toFixed(2) || '0.00'}</td>
                      <td style={{ color: '#000000' }}>{formatDate(order.orderDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
 
            <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,106,0,0.18)' }}>
              <p className="text-muted small mb-0">
                Showing <strong style={{ color: '#ff6a00' }}>{orders.length}</strong> orders
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
 
export default AdminOrders;