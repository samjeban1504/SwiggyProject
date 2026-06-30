import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deliveryBoyAPI } from '../services/api';
import { BiArrowBack, BiTrash, BiCycling } from 'react-icons/bi';
 
const thTd = {
  color: '#1a0a00',
  fontWeight: '700',
  padding: '14px 16px',
};
 
const AdminDeliveryBoys = () => {
  const navigate = useNavigate();
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
 
  useEffect(() => {
    const admin = localStorage.getItem('adminUser');
    if (!admin) { navigate('/admin/login'); return; }
    fetchDeliveryBoys();
  }, [navigate]);
 
  const fetchDeliveryBoys = async () => {
    try {
      setLoading(true);
      const res = await deliveryBoyAPI.getAll();
      setDeliveryBoys(res.data);
    } catch (err) {
      setError('Failed to load delivery boys');
    } finally {
      setLoading(false);
    }
  };
 
  const handleDeleteDeliveryBoy = async (id) => {
    if (window.confirm('Are you sure you want to delete this delivery partner?')) {
      try {
        await deliveryBoyAPI.delete(id);
        setDeliveryBoys(deliveryBoys.filter(d => d.id !== id));
      } catch (err) {
        setError('Failed to delete delivery boy');
      }
    }
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
            Manage <span style={{ color: '#ff6a00' }}>Delivery Partners</span>
          </h1>
          <p className="text-muted mb-0">View and manage all registered delivery partners.</p>
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
        ) : deliveryBoys.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <p style={{ color: '#ff6a00' }}>No delivery partners found</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-borderless align-middle mb-0 table-quick-header">
                <thead>
                  <tr>
                    <th style={{ color: '#ff6a00' }}>ID</th>
                    <th style={{ color: '#ff6a00' }}>Name</th>
                    <th style={{ color: '#ff6a00' }}>Phone</th>
                    <th style={{ color: '#ff6a00' }}>Email</th>
                    <th style={{ color: '#ff6a00' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryBoys.map((boy) => (
                    <tr key={boy.id}>
                      <td className="fw-bold" style={{ color: '#000000' }}>{boy.id}</td>
                      <td className="fw-bold" style={{ color: '#000000' }}>{boy.name}</td>
                      <td style={{ color: '#000000' }}>{boy.phone}</td>
                      <td style={{ color: '#000000' }}>{boy.email || '-'}</td>
                      <td>
                        <button
                          className="btn btn-quick-action-sm d-flex align-items-center gap-1"
                          onClick={() => handleDeleteDeliveryBoy(boy.id)}
                        >
                          <BiTrash size={15} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
 
            <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,106,0,0.18)' }}>
              <p className="text-muted small mb-0">
                Showing <strong style={{ color: '#ff6a00' }}>{deliveryBoys.length}</strong> delivery partners
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
 
export default AdminDeliveryBoys;