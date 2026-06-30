import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { BiUser, BiLock, BiLogInCircle, BiShieldAlt } from 'react-icons/bi';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (localStorage.getItem('adminUser')) {
      navigate('/admin/profile');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Username and password are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await adminAPI.login({ username, password });
      localStorage.setItem('adminUser', JSON.stringify(res.data));
      window.dispatchEvent(new Event('adminAuthChange')); // trigger navbar update
      navigate('/admin/profile');
    } catch (err) {
      setError('Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: '500px', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div className="w-100">
        <div className="text-center mb-5">
          <BiShieldAlt size={64} className="text-danger mb-3" style={{ filter: 'drop-shadow(0 0 20px rgba(220,53,69,0.5))' }} />
          <h1 className="fw-bold">Admin <span className="gradient-text">Panel</span></h1>
          <p className="text-muted">Sign in to manage the platform</p>
        </div>

        <div className="glass-card">
          <form onSubmit={handleLogin}>
            <h4 className="fw-bold mb-4">Admin Login 🔐</h4>
            {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}

            <div className="mb-3">
              <label className="form-label">Username</label>
              <div className="input-group">
                <span className="input-group-text glass-input border-end-0">
                  <BiUser size={18} className="text-danger" />
                </span>
                <input
                  type="text"
                  className="form-control glass-input border-start-0"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">Password</label>
              <div className="input-group">
                <span className="input-group-text glass-input border-end-0">
                  <BiLock size={18} className="text-danger" />
                </span>
                <input
                  type="password"
                  className="form-control glass-input border-start-0"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-danger w-100 py-3 mt-2 fw-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Signing in...
                </>
              ) : (
                <>
                  <BiLogInCircle size={20} className="me-2" />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-4">
          <p className="text-muted">
            Authorized personal only. Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
