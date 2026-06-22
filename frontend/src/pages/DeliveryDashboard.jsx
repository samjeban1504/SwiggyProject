import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI, foodAPI, restaurantAPI, userAPI, deliveryBoyAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { BiCycling, BiShoppingBag, BiNavigation, BiLogOut, BiUser } from 'react-icons/bi';

const DeliveryDashboard = () => {
  const navigate = useNavigate();
  const [deliveryBoy, setDeliveryBoy] = useState(null);
  const [orders, setOrders] = useState([]);
  const [foods, setFoods] = useState({});
  const [restaurants, setRestaurants] = useState({});
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    // Check login
    const stored = localStorage.getItem('deliveryBoy');
    if (!stored) {
      navigate('/delivery/login');
      return;
    }
    setDeliveryBoy(JSON.parse(stored));
  }, [navigate]);

  useEffect(() => {
    if (!deliveryBoy) return;
    fetchDeliveryContext();
  }, [deliveryBoy]);

  // Poll for updates every 3 seconds
  useEffect(() => {
    if (!deliveryBoy) return;
    const interval = setInterval(() => {
      fetchOrdersOnly();
    }, 3000);
    return () => clearInterval(interval);
  }, [deliveryBoy]);

  const fetchOrdersOnly = () => {
    orderAPI.getAll()
      .then((res) => setOrders(res.data))
      .catch((err) => console.error('Poll failed', err));
  };

  const fetchDeliveryContext = () => {
    setLoading(true);
    Promise.all([
      restaurantAPI.getAll(),
      foodAPI.getAll(),
      userAPI.getAll(),
      orderAPI.getAll(),
    ])
      .then(([restRes, foodRes, usersRes, ordersRes]) => {
        const restMap = {};
        restRes.data.forEach((r) => { restMap[r.id] = r; });
        setRestaurants(restMap);

        const foodMap = {};
        foodRes.data.forEach((f) => { foodMap[f.id] = f; });
        setFoods(foodMap);

        const userMap = {};
        usersRes.data.forEach((u) => { userMap[u.id] = u; });
        setUsers(userMap);

        setOrders(ordersRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Error loading delivery data.');
        setLoading(false);
      });
  };

  const handlePickUp = (order) => {
    // Assign this delivery boy to the order, then mark as picked
    orderAPI.assign(order.id, deliveryBoy.id)
      .then(() => orderAPI.pick(order.id))
      .then(() => fetchOrdersOnly())
      .catch((err) => {
        console.error(err);
        alert('Failed to pick up order.');
      });
  };

  const handleDeliver = (orderId) => {
    orderAPI.deliver(orderId)
      .then(() => fetchOrdersOnly())
      .catch((err) => {
        console.error(err);
        alert('Failed to mark as delivered.');
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('deliveryBoy');
    navigate('/delivery/login');
  };

  if (loading) return <LoadingSpinner message="Loading your deliveries..." />;
  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="glass-card mx-auto py-5" style={{ maxWidth: '500px' }}>
          <h3 className="text-danger">Error</h3>
          <p>{error}</p>
          <button className="btn btn-gradient mt-3" onClick={fetchDeliveryContext}>Try Again</button>
        </div>
      </div>
    );
  }

  // Pending: processed by restaurant, not yet delivered, either unassigned OR assigned to me
  const pendingDeliveries = orders.filter(
    (o) => o.foodProcess && o.foodReady && !o.foodDelivered &&
      (o.deliveryBoyId === null || o.deliveryBoyId === undefined || o.deliveryBoyId === deliveryBoy?.id)
  );
  // My history: delivered orders assigned to me
  const deliveryHistory = orders.filter(
    (o) => o.foodDelivered && o.deliveryBoyId === deliveryBoy?.id
  );

  const activeOrdersList = activeTab === 'pending' ? pendingDeliveries : deliveryHistory;

  return (
    <div className="container py-4">
      {/* Delivery Boy Profile Card */}
      {deliveryBoy && (
        <div className="glass-card mb-5 d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff6b35, #ff4b1f)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <BiUser size={28} color="white" />
            </div>
            <div>
              <h4 className="fw-bold mb-0">{deliveryBoy.name}</h4>
              <span className="text-muted small">📞 {deliveryBoy.phone}
                {deliveryBoy.vehicleNumber && <> &nbsp;|&nbsp; 🏍️ {deliveryBoy.vehicleNumber}</>}
              </span>
            </div>
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-50 px-3 py-2">
              🟢 Online
            </span>
            <button className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1" onClick={handleLogout}>
              <BiLogOut size={16} /> Logout
            </button>
          </div>
        </div>
      )}

      <div className="text-center mb-4">
        <BiCycling size={48} className="text-warning mb-2" />
        <h2 className="fw-bold">Delivery <span className="gradient-text">Dashboard</span></h2>
        <p className="text-muted">Accept pickups and deliver joy to customers</p>
      </div>

      {/* Tabs */}
      <div className="d-flex justify-content-center gap-3 mb-4">
        <button
          className={`btn px-4 py-2 ${activeTab === 'pending' ? 'btn-gradient' : 'btn-outline-secondary'}`}
          onClick={() => setActiveTab('pending')}
        >
          Active Deliveries ({pendingDeliveries.length})
        </button>
        <button
          className={`btn px-4 py-2 ${activeTab === 'history' ? 'btn-secondary-gradient' : 'btn-outline-secondary'}`}
          onClick={() => setActiveTab('history')}
        >
          My History ({deliveryHistory.length})
        </button>
      </div>

      {activeOrdersList.length === 0 ? (
        <div className="text-center py-5 glass-card mx-auto" style={{ maxWidth: '500px' }}>
          <BiShoppingBag size={48} className="text-muted mb-3" />
          <h3>
            {activeTab === 'pending' ? 'No Active Deliveries' : 'No Completed Deliveries'}
          </h3>
          <p className="text-muted">
            {activeTab === 'pending'
              ? 'Waiting for restaurants to process orders...'
              : 'Your completed deliveries will appear here.'}
          </p>
        </div>
      ) : (
        <div className="row g-4">
          {activeOrdersList.map((order) => {
            const food = foods[order.foodId] || { foodName: 'Unknown Dish' };
            const rest = restaurants[order.restaurantId] || { restaurantName: 'Unknown', phone: 'N/A', address: 'N/A' };
            const customer = users[order.userId] || { name: 'Customer', phone: 'N/A', address: 'N/A' };
            const isMyOrder = order.deliveryBoyId === deliveryBoy?.id;

            return (
              <div className="col-12" key={order.id}>
                <div className="glass-card">
                  <div className="row g-4 align-items-center">
                    {/* Order Info */}
                    <div className="col-lg-3 col-md-4">
                      <span className="text-warning small fw-bold d-block mb-1">ORDER #{order.id}</span>
                      <h4 className="fw-bold mb-2">{food.foodName}</h4>
                      <p className="text-muted small mb-1">Qty: {order.quantity}</p>
                      <p className="text-warning small fw-bold mb-0">₹{order.totalAmount?.toFixed(2)}</p>
                      <span className="badge mt-2"
                        style={{
                          background: order.paymentMethod === 'COD' ? 'rgba(255,193,7,0.2)' : 'rgba(46,196,182,0.2)',
                          color: order.paymentMethod === 'COD' ? '#ffe066' : '#5ee8dc',
                          border: `1px solid ${order.paymentMethod === 'COD' ? 'rgba(255,193,7,0.4)' : 'rgba(46,196,182,0.4)'}`,
                        }}>
                        {order.paymentMethod || 'PAID'}
                      </span>
                    </div>

                    {/* Pickup */}
                    <div className="col-lg-4 col-md-4 border-start border-secondary border-opacity-10 ps-md-4">
                      <span className="badge bg-warning bg-opacity-10 text-warning mb-2">1. PICK UP FROM</span>
                      <h5 className="fw-bold mb-1">{rest.restaurantName}</h5>
                      <p className="text-muted small mb-1">📞 {rest.phone}</p>
                      <p className="text-muted small mb-0">📍 {rest.address}</p>
                    </div>

                    {/* Deliver To */}
                    <div className="col-lg-3 col-md-4 border-start border-secondary border-opacity-10 ps-md-4">
                      <span className="badge bg-info bg-opacity-10 text-info mb-2">2. DELIVER TO</span>
                      <h5 className="fw-bold mb-1">{customer.name}</h5>
                      <p className="text-muted small mb-1">📞 {customer.phone}</p>
                      <p className="text-muted small mb-0">📍 {customer.address}</p>
                    </div>

                    {/* Action */}
                    <div className="col-lg-2 col-md-12 d-flex align-items-center justify-content-center border-start border-secondary border-opacity-10 ps-md-4">
                      {activeTab === 'history' ? (
                        <span className="status-badge status-delivered">Completed ✓</span>
                      ) : !order.foodPicked ? (
                        <button
                          className="btn btn-gradient w-100 py-3 d-flex align-items-center justify-content-center gap-1"
                          onClick={() => handlePickUp(order)}
                        >
                          <BiShoppingBag size={18} />
                          <span>Pick Up</span>
                        </button>
                      ) : (
                        <button
                          className="btn w-100 py-3 d-flex align-items-center justify-content-center gap-1"
                          onClick={() => handleDeliver(order.id)}
                          style={{ background: 'linear-gradient(135deg, #2ec4b6, #0f9b8e)', color: 'white', border: 'none' }}
                        >
                          <BiNavigation size={18} />
                          <span>Delivered ✓</span>
                        </button>
                      )}
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

export default DeliveryDashboard;
