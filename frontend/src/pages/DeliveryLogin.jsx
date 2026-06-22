import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deliveryBoyAPI } from '../services/api';
import { BiCycling, BiUser, BiPhone, BiLockAlt, BiLogInCircle, BiPlusCircle } from 'react-icons/bi';

const DeliveryLogin = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' or 'register'

  React.useEffect(() => {
    if (localStorage.getItem('deliveryBoy')) {
      navigate('/delivery/dashboard');
    }
  }, [navigate]);

  // Validation helpers
  const isValidPhone = (phone) => /^\d{10}$/.test(phone.replace(/\D/g, ''));
  const isValidName = (name) => /^[a-zA-Z\s'-]+$/.test(name) && name.trim().length >= 2;
  const isValidEmail = (email) => !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidVehicle = (vehicle) => !vehicle || /^[A-Z0-9\s-]+$/.test(vehicle);

  // Login state
  const [loginPhone, setLoginPhone] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Register state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regVehicle, setRegVehicle] = useState('');
  const [regError, setRegError] = useState('');
  const [regLoading, setRegLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

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
      const res = await deliveryBoyAPI.login(cleanPhone);
      const deliveryBoy = res.data;
      localStorage.setItem('deliveryBoy', JSON.stringify(deliveryBoy));
      navigate('/delivery/dashboard');
    } catch (err) {
      setLoginError('No delivery boy found with this phone. Please register first.');
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

    if (regVehicle && !isValidVehicle(regVehicle)) {
      newErrors.vehicle = 'Vehicle number should only contain letters, numbers, spaces, and hyphens.';
    }

    setValidationErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setRegError('Please fix the errors below.');
      return;
    }

    setRegLoading(true);
    try {
      const cleanPhone = regPhone.replace(/\D/g, '');
      const res = await deliveryBoyAPI.register({
        name: regName,
        phone: cleanPhone,
        email: regEmail,
        vehicleNumber: regVehicle,
      });
      const deliveryBoy = res.data;
      localStorage.setItem('deliveryBoy', JSON.stringify(deliveryBoy));
      navigate('/delivery/dashboard');
    } catch (err) {
      setRegError('Registration failed. Please try again.');
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: '500px' }}>
      <div className="text-center mb-5">
        <BiCycling size={64} className="text-warning mb-3" style={{ filter: 'drop-shadow(0 0 20px rgba(255,193,7,0.5))' }} />
        <h1 className="fw-bold">Delivery <span className="gradient-text">Partner</span></h1>
        <p className="text-muted">Login or register to access your delivery dashboard</p>
      </div>

      {/* Mode Toggle */}
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
            <button
              type="submit"
              className="btn btn-gradient w-100 py-3 mt-2"
              disabled={loginLoading}
            >
              {loginLoading ? (
                <><span className="spinner-border spinner-border-sm me-2" />Logging in...</>
              ) : (
                <><BiLogInCircle size={20} className="me-2" />Login to Dashboard</>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <h4 className="fw-bold mb-4">Join as Delivery Partner 🚴</h4>
            {regError && <div className="alert alert-danger py-2 mb-3">{regError}</div>}
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className={`form-control glass-input ${validationErrors.name ? 'border-danger' : ''}`}
                  placeholder="Rahul Kumar"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                />
                {validationErrors.name && <small className="text-danger">{validationErrors.name}</small>}
              </div>
              <div className="col-12">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  className={`form-control glass-input ${validationErrors.phone ? 'border-danger' : ''}`}
                  placeholder="9876543210"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  maxLength="10"
                  required
                />
                {validationErrors.phone && <small className="text-danger">{validationErrors.phone}</small>}
                <small className="text-muted mt-1 d-block">10-digit number only</small>
              </div>
              <div className="col-12">
                <label className="form-label">Email (Optional)</label>
                <input
                  type="email"
                  className={`form-control glass-input ${validationErrors.email ? 'border-danger' : ''}`}
                  placeholder="rahul@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                />
                {validationErrors.email && <small className="text-danger">{validationErrors.email}</small>}
              </div>
              <div className="col-12">
                <label className="form-label">Vehicle Number (Optional)</label>
                <input
                  type="text"
                  className={`form-control glass-input ${validationErrors.vehicle ? 'border-danger' : ''}`}
                  placeholder="MH12AB1234"
                  value={regVehicle}
                  onChange={(e) => setRegVehicle(e.target.value.toUpperCase())}
                />
                {validationErrors.vehicle && <small className="text-danger">{validationErrors.vehicle}</small>}
                <small className="text-muted mt-1 d-block">Letters, numbers, spaces, hyphens only</small>
              </div>
              <div className="col-12 mt-2">
                <button
                  type="submit"
                  className="btn btn-gradient w-100 py-3"
                  disabled={regLoading}
                >
                  {regLoading ? (
                    <><span className="spinner-border spinner-border-sm me-2" />Registering...</>
                  ) : (
                    <><BiCycling size={20} className="me-2" />Register & Start Delivering</>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default DeliveryLogin;
