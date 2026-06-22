import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { userAPI } from '../services/api';
import { BiUser, BiPhone, BiLogInCircle, BiPlusCircle } from 'react-icons/bi';

const CustomerLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState('login'); // 'login' or 'register'

  // If redirected from Cart, we might want to send them back there after login
  const fromCart = location.state?.from === '/customer/cart';

  React.useEffect(() => {
    if (localStorage.getItem('customerUser')) {
      navigate(fromCart ? '/customer/cart' : '/customer/profile');
    }
  }, [navigate, fromCart]);

  // Validation helpers
  const isValidPhone = (phone) => /^\d{10}$/.test(phone.replace(/\D/g, ''));
  const isValidName = (name) => /^[a-zA-Z\s'-]+$/.test(name) && name.trim().length >= 2;
  const isValidEmail = (email) => !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Login state
  const [loginPhone, setLoginPhone] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Register state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regError, setRegError] = useState('');
  const [regLoading, setRegLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleSuccess = (user) => {
    localStorage.setItem('customerUser', JSON.stringify(user));
    if (fromCart) {
      navigate('/customer/cart');
    } else {
      navigate('/customer/profile');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    const cleanPhone = loginPhone.replace(/\D/g, '');
    if (!loginPhone.trim()) {
      setLoginError('Please enter your phone number.');
      return;
    }
    if (!isValidPhone(loginPhone)) {
      setLoginError('Phone number must be exactly 10 digits.');
      return;
    }
    setLoginLoading(true);
    try {
      const res = await userAPI.login(cleanPhone);
      handleSuccess(res.data);
    } catch (err) {
      setLoginError('No account found with this phone. Please register first.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError('');
    const newErrors = {};

    if (!regName.trim()) {
      newErrors.name = 'Name is required.';
    } else if (!isValidName(regName)) {
      newErrors.name = 'Name should only contain letters, spaces, hyphens, or apostrophes.';
    }

    if (!regPhone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!isValidPhone(regPhone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits.';
    }

    if (regEmail && !isValidEmail(regEmail)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!regAddress.trim()) {
      newErrors.address = 'Delivery address is required.';
    }

    setValidationErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setRegError('Please fix the errors below.');
      return;
    }

    setRegLoading(true);
    try {
      const cleanPhone = regPhone.replace(/\D/g, '');
      const res = await userAPI.create({
        name: regName,
        phone: cleanPhone,
        email: regEmail,
        address: regAddress,
      });
      handleSuccess(res.data);
    } catch (err) {
      setRegError('Registration failed. Please try again.');
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: '500px' }}>
      <div className="text-center mb-5">
        <BiUser size={64} className="text-warning mb-3" style={{ filter: 'drop-shadow(0 0 20px rgba(255,193,7,0.5))' }} />
        <h1 className="fw-bold">Welcome to <span className="gradient-text">Swiggy</span></h1>
        <p className="text-muted">Login or create an account to start ordering</p>
      </div>

      <div className="d-flex gap-2 mb-4 p-1 glass-card" style={{ borderRadius: '14px' }}>
        <button
          className={`btn flex-fill py-2 fw-semibold ${mode === 'login' ? 'btn-gradient' : ''}`}
          style={mode !== 'login' ? { background: 'transparent', color: '#c8cdde', border: 'none' } : {}}
          onClick={() => setMode('login')}
        >
          <BiLogInCircle className="me-2" />Login
        </button>
        <button
          className={`btn flex-fill py-2 fw-semibold ${mode === 'register' ? 'btn-gradient' : ''}`}
          style={mode !== 'register' ? { background: 'transparent', color: '#c8cdde', border: 'none' } : {}}
          onClick={() => setMode('register')}
        >
          <BiPlusCircle className="me-2" />Register
        </button>
      </div>

      <div className="glass-card">
        {mode === 'login' ? (
          <form onSubmit={handleLogin}>
            <h4 className="fw-bold mb-4">Welcome Back 👋</h4>
            {loginError && <div className="alert alert-danger py-2 mb-3">{loginError}</div>}
            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <div className="input-group">
                <span className="input-group-text glass-input border-end-0">
                  <BiPhone size={18} className="text-warning" />
                </span>
                <input
                  type="tel"
                  className="form-control glass-input border-start-0"
                  placeholder="9876543210"
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  maxLength="10"
                  required
                />
              </div>
              <small className="text-muted mt-1 d-block">Enter 10-digit phone number</small>
            </div>
            <button type="submit" className="btn btn-gradient w-100 py-3 mt-2" disabled={loginLoading}>
              {loginLoading ? <><span className="spinner-border spinner-border-sm me-2" />Logging in...</> : <><BiLogInCircle size={20} className="me-2" />Log In</>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <h4 className="fw-bold mb-4">Create an Account ✨</h4>
            {regError && <div className="alert alert-danger py-2 mb-3">{regError}</div>}
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label">Full Name *</label>
                <input type="text" className={`form-control glass-input ${validationErrors.name ? 'border-danger' : ''}`} placeholder="John Doe" value={regName} onChange={(e) => setRegName(e.target.value)} required />
                {validationErrors.name && <small className="text-danger">{validationErrors.name}</small>}
              </div>
              <div className="col-12">
                <label className="form-label">Phone Number *</label>
                <input type="tel" className={`form-control glass-input ${validationErrors.phone ? 'border-danger' : ''}`} placeholder="9876543210" value={regPhone} onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} maxLength="10" required />
                {validationErrors.phone && <small className="text-danger">{validationErrors.phone}</small>}
                <small className="text-muted mt-1 d-block">10-digit number only</small>
              </div>
              <div className="col-12">
                <label className="form-label">Email (Optional)</label>
                <input type="email" className={`form-control glass-input ${validationErrors.email ? 'border-danger' : ''}`} placeholder="john@example.com" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
                {validationErrors.email && <small className="text-danger">{validationErrors.email}</small>}
              </div>
              <div className="col-12">
                <label className="form-label">Delivery Address *</label>
                <textarea className={`form-control glass-input ${validationErrors.address ? 'border-danger' : ''}`} placeholder="Enter your full address" value={regAddress} onChange={(e) => setRegAddress(e.target.value)} rows="2" required />
                {validationErrors.address && <small className="text-danger">{validationErrors.address}</small>}
              </div>
              <div className="col-12 mt-3">
                <button type="submit" className="btn btn-gradient w-100 py-3" disabled={regLoading}>
                  {regLoading ? <><span className="spinner-border spinner-border-sm me-2" />Creating Profile...</> : <><BiUser size={20} className="me-2" />Create Profile</>}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CustomerLogin;
