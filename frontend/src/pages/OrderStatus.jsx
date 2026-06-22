import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { orderAPI, foodAPI, restaurantAPI, userAPI, deliveryBoyAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { BiTimeFive, BiShoppingBag, BiCycling, BiCheckCircle, BiUser, BiLogOut } from 'react-icons/bi';

const OrderStatus = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [foods, setFoods] = useState({});
  const [restaurants, setRestaurants] = useState({});
  const [deliveryBoys, setDeliveryBoys] = useState({});
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deliveredOrders, setDeliveredOrders] = useState(new Set());
  const [newlyDelivered, setNewlyDelivered] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('customerUser');
    if (!storedUser) {
      navigate('/customer/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      restaurantAPI.getAll(),
      foodAPI.getAll(),
      orderAPI.getByUser(user.id),
      deliveryBoyAPI.getAll(),
    ])
      .then(([restRes, foodRes, ordersRes, dbRes]) => {
        const restMap = {};
        restRes.data.forEach((r) => { restMap[r.id] = r; });
        setRestaurants(restMap);

        const foodMap = {};
        foodRes.data.forEach((f) => { foodMap[f.id] = f; });
        setFoods(foodMap);

        const dbMap = {};
        dbRes.data.forEach((d) => { dbMap[d.id] = d; });
        setDeliveryBoys(dbMap);

        const sorted = ordersRes.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        setOrders(sorted);

        const alreadyDelivered = new Set(sorted.filter((o) => o.foodDelivered).map((o) => o.id));
        setDeliveredOrders(alreadyDelivered);

        setLoading(false);
      })
      .catch(() => {
        setError('Error loading tracking data.');
        setLoading(false);
      });
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      orderAPI.getByUser(user.id)
        .then((res) => {
          const sorted = res.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

          sorted.forEach((order) => {
            if (order.foodDelivered && !deliveredOrders.has(order.id)) {
              setNewlyDelivered(order.id);
              setDeliveredOrders((prev) => new Set([...prev, order.id]));
              setTimeout(() => setNewlyDelivered(null), 8000);
            }
          });

          setOrders(sorted);
        })
        .catch((err) => console.error('Poll failed', err));
    }, 3000);
    return () => clearInterval(interval);
  }, [user, deliveredOrders]);

  const handleLogout = () => {
    localStorage.removeItem('customerUser');
    navigate('/customer/login');
  };

  if (loading) return <LoadingSpinner message="Loading your profile..." />;

  if (error || !user) {
    return (
      <div className="container py-5 text-center">
        <div className="glass-card mx-auto py-5" style={{ maxWidth: '500px' }}>
          <h3 className="text-danger">Error</h3>
          <p>{error || 'Customer profile not found.'}</p>
          <Link to="/customer/restaurants" className="btn btn-gradient mt-3">Browse Restaurants</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* 🎉 Delivery Success Banner */}
      {newlyDelivered && (
        <div style={{
          position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 2000, width: '90%', maxWidth: '560px',
          background: 'linear-gradient(135deg, rgba(46,196,182,0.95), rgba(15,155,142,0.95))',
          borderRadius: '18px', padding: '1.25rem 2rem',
          boxShadow: '0 8px 40px rgba(46,196,182,0.4)',
          animation: 'fadeInDown 0.5s ease',
        }}>
          <div className="d-flex align-items-center gap-3">
            <span style={{ fontSize: '2.5rem' }}>🎉</span>
            <div>
              <h5 className="fw-bold mb-0" style={{ color: '#fff' }}>Order #{newlyDelivered} Delivered!</h5>
              <p className="mb-0" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>
                Your food has arrived. Enjoy your meal! 😋
              </p>
            </div>
            <button className="btn btn-sm ms-auto"
              style={{ background: 'rgba(255,255,255,0.2)', color: 'white', borderRadius: '8px' }}
              onClick={() => setNewlyDelivered(null)}>✕</button>
          </div>
        </div>
      )}

      {/* Profile Header */}
      <div className="glass-card mb-5 d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div className="d-flex align-items-center gap-3">
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff6b35, #ff4b1f)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <BiUser size={32} color="white" />
          </div>
          <div>
            <h3 className="fw-bold mb-0 text-white">{user.name}</h3>
            <span className="text-muted small">📞 {user.phone} {user.email && ` | ✉️ ${user.email}`}</span>
            <span className="d-block text-muted small mt-1">📍 {user.address}</span>
          </div>
        </div>
        <button className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1" onClick={handleLogout}>
          <BiLogOut size={16} /> Logout
        </button>
      </div>

      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <h2 className="fw-bold mb-0">My <span className="gradient-text">Orders</span></h2>
        <Link to="/customer/restaurants" className="btn btn-secondary-gradient">Order Something Else</Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-5 glass-card mx-auto" style={{ maxWidth: '500px' }}>
          <BiShoppingBag size={64} className="text-muted mb-3" />
          <h3>No Orders Yet</h3>
          <p className="text-muted">You haven't placed any orders.</p>
          <Link to="/customer/restaurants" className="btn btn-gradient mt-2">Browse Menus</Link>
        </div>
      ) : (
        <div className="row g-4">
          {orders.map((order) => {
            const food = foods[order.foodId] || { foodName: 'Unknown Dish' };
            const rest = restaurants[order.restaurantId] || { restaurantName: 'Unknown Restaurant' };
            const deliveryBoy = order.deliveryBoyId ? deliveryBoys[order.deliveryBoyId] : null;
            const isProcessing = order.foodProcess;
            const isReady = order.foodReady;
            const isPicked = order.foodPicked;
            const isDelivered = order.foodDelivered;

            return (
              <div className="col-12" key={order.id}>
                <div className={`glass-card p-4 border-start border-4 ${isDelivered ? 'border-success' : 'border-warning'}`}>
                  {isDelivered && (
                    <div className="mb-3 p-3 rounded-3 d-flex align-items-center gap-2"
                      style={{ background: 'rgba(46,196,182,0.12)', border: '1px solid rgba(46,196,182,0.3)' }}>
                      <BiCheckCircle size={22} style={{ color: '#5ee8dc', flexShrink: 0 }} />
                      <span style={{ color: '#5ee8dc' }} className="fw-semibold">
                        🎉 Your food has been delivered! Enjoy your meal!
                      </span>
                    </div>
                  )}

                  <div className="row g-4">
                    <div className="col-md-5">
                      <div className="d-flex align-items-center gap-2 mb-2 small" style={{ color: '#ffe066' }}>
                        <BiTimeFive />
                        <span>Placed: {new Date(order.orderDate).toLocaleString()}</span>
                      </div>
                      <h3 className="h4 fw-bold mb-1">{food.foodName}</h3>
                      <p className="text-muted mb-2">From: <span style={{ color: '#f0f0f0' }}>{rest.restaurantName}</span></p>

                      <div className="d-flex gap-3 p-3 rounded-3 mb-3 small" style={{ background: 'rgba(0,0,0,0.2)' }}>
                        <div>
                          <span className="text-muted d-block">Qty</span>
                          <span className="fw-bold">{order.quantity}</span>
                        </div>
                        <div className="border-start border-secondary border-opacity-25 ps-3">
                          <span className="text-muted d-block">Total Paid</span>
                          <span className="fw-bold text-warning">₹{order.totalAmount?.toFixed(2)}</span>
                        </div>
                        <div className="border-start border-secondary border-opacity-25 ps-3">
                          <span className="text-muted d-block">Payment</span>
                          <span className="fw-bold">{order.paymentMethod || 'PAID'}</span>
                        </div>
                      </div>

                      {deliveryBoy && (
                        <div className="p-2 rounded-3 d-flex align-items-center gap-2"
                          style={{ background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.2)' }}>
                          <BiCycling size={20} style={{ color: '#ff6b35' }} />
                          <div>
                            <span className="text-muted small d-block">Delivery Partner</span>
                            <span className="fw-semibold" style={{ color: '#ff6b35' }}>{deliveryBoy.name}</span>
                            <span className="text-muted small ms-2">📞 {deliveryBoy.phone}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="col-md-7 border-start border-secondary border-opacity-10 ps-md-5">
                      <h4 className="h5 fw-bold mb-4">Delivery Timeline</h4>
                      <ul className="timeline mb-0">
                        <li className={`timeline-item ${isProcessing ? 'completed' : 'active'}`}>
                          <span className="timeline-icon">{isProcessing ? '✓' : '1'}</span>
                          <div>
                            <h5 className="h6 fw-bold mb-1">Food Preparation</h5>
                            <p className="text-muted small mb-0">
                              {isProcessing ? 'Kitchen has accepted your order ✅' : 'Waiting for restaurant acceptance...'}
                            </p>
                          </div>
                        </li>
                        <li className={`timeline-item ${isReady ? 'completed' : isProcessing ? 'active' : ''}`}>
                          <span className="timeline-icon">{isReady ? '✓' : '2'}</span>
                          <div>
                            <h5 className="h6 fw-bold mb-1">Food Ready</h5>
                            <p className="text-muted small mb-0">
                              {isReady ? 'Your food is ready for pickup!' : 'Preparing the order in the kitchen...'}
                            </p>
                          </div>
                        </li>
                        <li className={`timeline-item ${isPicked ? 'completed' : isReady ? 'active' : ''}`}>
                          <span className="timeline-icon">{isPicked ? '✓' : '2'}</span>
                          <div>
                            <h5 className="h6 fw-bold mb-1">Order Picked Up</h5>
                            <p className="text-muted small mb-0">
                              {isPicked
                                ? `${deliveryBoy ? deliveryBoy.name : 'Delivery partner'} has picked up your food ✅`
                                : 'Waiting for delivery partner...'}
                            </p>
                          </div>
                        </li>
                        <li className={`timeline-item ${isDelivered ? 'completed' : isPicked ? 'active' : ''}`}>
                          <span className="timeline-icon">{isDelivered ? '✓' : '3'}</span>
                          <div>
                            <h5 className="h6 fw-bold mb-1">Delivered</h5>
                            <p className="text-muted small mb-0">
                              {isDelivered ? 'Food delivered successfully! Enjoy! 🎉' : 'On the way to your address...'}
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderStatus;
