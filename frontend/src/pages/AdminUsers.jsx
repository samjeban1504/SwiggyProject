import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import { BiArrowBack, BiTrash, BiUser } from 'react-icons/bi';
 
const thTd = {
  color: '#1a0a00',
  fontWeight: '700',
  padding: '14px 16px',
};
 
const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
 
  useEffect(() => {
    const admin = localStorage.getItem('adminUser');
    if (!admin) { navigate('/admin/login'); return; }
    fetchUsers();
  }, [navigate]);
 
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userAPI.getAll();
      setUsers(res.data);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };
 
  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await userAPI.delete(id);
        setUsers(users.filter((u) => u.id !== id));
      } catch (err) {
        setError('Failed to delete user');
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
            Customer <span style={{ color: '#ff6a00' }}>Worksheet</span>
          </h1>
          <p className="text-muted mb-0">Simple customer management with a refreshed page color palette.</p>
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
        ) : users.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <h4 style={{ color: '#ff6a00' }}>No customers found</h4>
            <p className="text-muted">There are no registered users in the system yet.</p>
          </div>
        ) : (
          <>
            <div className="table-responsive d-none d-lg-block">
              <table className="table table-borderless align-middle mb-0 table-quick-header">
                <thead>
                  <tr>
                    <th style={{ color: '#ff6a00' }}>ID</th>
                    <th style={{ color: '#ff6a00' }}>Name</th>
                    <th style={{ color: '#ff6a00' }}>Phone</th>
                    <th style={{ color: '#ff6a00' }}>Email</th>
                    <th style={{ color: '#ff6a00' }}>Address</th>
                    <th style={{ color: '#ff6a00' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="fw-bold" style={{ color: '#000000' }}>{user.id}</td>
                      <td className="fw-bold" style={{ color: '#000000' }}>{user.name}</td>
                      <td style={{ color: '#000000' }}>{user.phone}</td>
                      <td style={{ color: '#000000' }}>{user.email || '-'}</td>
                      <td style={{ color: '#000000' }}>{user.address}</td>
                      <td>
                        <button
                          className="btn btn-quick-action-sm d-flex align-items-center gap-1"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <BiTrash size={15} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
 
            <div className="d-lg-none">
              <div className="row g-3">
                {users.map((user) => (
                  <div className="col-12" key={user.id}>
                    <div className="glass-card p-3" style={{ backgroundColor: 'rgba(255,106,0,0.05)', border: '1px solid rgba(255,106,0,0.15)', borderRadius: '16px' }}>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h6 className="fw-bold mb-1" style={{ color: '#000000' }}>{user.name}</h6>
                          <p className="small mb-0" style={{ color: '#000000' }}>ID: {user.id}</p>
                        </div>
                        <button
                          className="btn btn-sm d-flex align-items-center gap-1"
                          style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', color: '#1a0a00', border: 'none', borderRadius: '8px', fontWeight: '600', padding: '6px 14px' }}
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <BiTrash size={15} /> Delete
                        </button>
                      </div>
                      <p className="small mb-1" style={{ color: '#000000' }}><strong>Phone:</strong> {user.phone}</p>
                      <p className="small mb-1" style={{ color: '#000000' }}><strong>Email:</strong> {user.email || '-'}</p>
                      <p className="small mb-0" style={{ color: '#000000' }}><strong>Address:</strong> {user.address}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
 
            <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,106,0,0.18)' }}>
              <p className="text-muted small mb-0">
                Showing <strong style={{ color: '#ff6a00' }}>{users.length}</strong> customers
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
 
export default AdminUsers;