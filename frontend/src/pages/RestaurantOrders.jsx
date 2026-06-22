import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderAPI, foodAPI, restaurantAPI, userAPI, deliveryBoyAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { BiChevronLeft, BiShoppingBag, BiTimeFive, BiUser, BiFoodMenu, BiCheckCircle, BiCycling, BiBell } from 'react-icons/bi';

const RestaurantOrders = () => {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [foods, setFoods] = useState({});
  const [users, setUsers] = useState({});
  const [deliveryBoys, setDeliveryBoys] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newlyDelivered, setNewlyDelivered] = useState(null);
  const [newOrderAlert, setNewOrderAlert] = useState(null);
  const [deliveredSet, setDeliveredSet] = useState(new Set());
  const [knownOrderIds, setKnownOrderIds] = useState(new Set());
  const [initialOrdersLoaded, setInitialOrdersLoaded] = useState(false);

  useEffect(() => { fetchOrderDetails(); }, [restaurantId]);

  // Poll every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => fetchOrdersOnly(), 3000);
    return () => clearInterval(interval);
  }, [restaurantId, deliveredSet, knownOrderIds, initialOrdersLoaded]);

  const fetchOrdersOnly = () => {
    Promise.all([orderAPI.getAll(), deliveryBoyAPI.getAll()])
      .then(([ordersRes, dbRes]) => {
        const dbMap = {};
        dbRes.data.forEach((d) => { dbMap[d.id] = d; });
        setDeliveryBoys(dbMap);

        const filtered = ordersRes.data.filter((o) => o.restaurantId.toString() === restaurantId.toString());
        const sorted = filtered.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

        // Detect newly delivered orders
        sorted.forEach((order) => {
          if (order.foodDelivered && !deliveredSet.has(order.id)) {
            setNewlyDelivered(order);
            setDeliveredSet((prev) => new Set([...prev, order.id]));
            setTimeout(() => setNewlyDelivered(null), 8000);
          }
        });

        // Detect newly placed orders for this restaurant
        if (initialOrdersLoaded) {
          const newOrders = sorted.filter((order) => !knownOrderIds.has(order.id));
          if (newOrders.length > 0) {
            setNewOrderAlert(newOrders[0]);
            setTimeout(() => setNewOrderAlert(null), 10000);
          }
        }

        setKnownOrderIds(new Set(sorted.map((o) => o.id)));
        setOrders(sorted);
      })
      .catch((err) => console.error('Poll failed', err));
  };

  const fetchOrderDetails = () => {
    setLoading(true);
    Promise.all([
      restaurantAPI.getById(restaurantId),
      foodAPI.getAll(),
      userAPI.getAll(),
      orderAPI.getAll(),
      deliveryBoyAPI.getAll(),
    ])
      .then(([restRes, foodRes, usersRes, ordersRes, dbRes]) => {
        setRestaurant(restRes.data);

        const foodMap = {};
        foodRes.data.forEach((f) => { foodMap[f.id] = f; });
        setFoods(foodMap);

        const userMap = {};
        usersRes.data.forEach((u) => { userMap[u.id] = u; });
        setUsers(userMap);

        const dbMap = {};
        dbRes.data.forEach((d) => { dbMap[d.id] = d; });
        setDeliveryBoys(dbMap);

        const filtered = ordersRes.data.filter((o) => o.restaurantId.toString() === restaurantId.toString());
        const sorted = filtered.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        setOrders(sorted);

        // Initialize delivered set and known order IDs
        const alreadyDone = new Set(sorted.filter((o) => o.foodDelivered).map((o) => o.id));
        setDeliveredSet(alreadyDone);
        setKnownOrderIds(new Set(sorted.map((o) => o.id)));
        setInitialOrdersLoaded(true);

        setLoading(false);
      })
      .catch(() => {
        setError('Error loading orders.');
        setLoading(false);
      });
  };

  const handleProcessOrder = (orderId) => {
    orderAPI.process(orderId)
      .then(() => {
        fetchOrdersOnly();
        setTimeout(fetchOrdersOnly, 3000);
      })
      .catch(() => alert('Failed to process order.'));
  };

  if (loading) return <LoadingSpinner message="Checking kitchen receipts..." />;

  if (error || !restaurant) {
    return (
      <div className="container py-5 text-center">
        <div className="glass-card mx-auto py-5" style={{ maxWidth: '500px' }}>
          <h3 className="text-danger">Error</h3>
          <p>{error || 'Restaurant not found.'}</p>
          <Link to="/restaurant/dashboard" className="btn btn-gradient mt-3">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const pendingOrders = orders.filter((o) => !o.foodDelivered);
  const completedOrders = orders.filter((o) => o.foodDelivered);

  return (
    <div className="container py-5">
      {/* 🔔 New Order Notification for Restaurant */}
      {newOrderAlert && (
        <div style={{
          position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 2000, width: '90%', maxWidth: '580px',
          background: 'linear-gradient(135deg, rgba(249,115,22,0.95), rgba(234,88,12,0.95))',
          borderRadius: '18px', padding: '1.25rem 2rem',
          boxShadow: '0 8px 40px rgba(249,115,22,0.35)',
        }}>
          <div className="d-flex align-items-center gap-3">
            <BiBell size={32} style={{ color: '#fff' }} />
            <div>
              <h5 className="fw-bold mb-0" style={{ color: '#fff' }}>New order received!</h5>
              <p className="mb-0" style={{ color: 'rgba(255,255,255,0.90)', fontSize: '0.95rem' }}>
                Order #{newOrderAlert.id} for {foods[newOrderAlert.foodId]?.foodName || 'a dish'} has just arrived.
              </p>
            </div>
            <button className="btn btn-sm ms-auto"
              style={{ background: 'rgba(255,255,255,0.2)', color: 'white', borderRadius: '8px' }}
              onClick={() => setNewOrderAlert(null)}>✕</button>
          </div>
        </div>
      )}

      {/* 🎉 Delivery Alert Banner for Restaurant */}
      {newlyDelivered && (
        <div style={{
          position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 2000, width: '90%', maxWidth: '580px',
          background: 'linear-gradient(135deg, rgba(46,196,182,0.95), rgba(15,155,142,0.95))',
          borderRadius: '18px', padding: '1.25rem 2rem',
          boxShadow: '0 8px 40px rgba(46,196,182,0.45)',
        }}>
          <div className="d-flex align-items-center gap-3">
            <span style={{ fontSize: '2.5rem' }}>✅</span>
            <div>
              <h5 className="fw-bold mb-0" style={{ color: '#fff' }}>Order #{newlyDelivered.id} Delivered!</h5>
              <p className="mb-0" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>
                {newlyDelivered.deliveryBoyId && deliveryBoys[newlyDelivered.deliveryBoyId]
                  ? `Delivered by ${deliveryBoys[newlyDelivered.deliveryBoyId].name}`
                  : 'Order delivered successfully to the customer.'}
              </p>
            </div>
            <button className="btn btn-sm ms-auto"
              style={{ background: 'rgba(255,255,255,0.2)', color: 'white', borderRadius: '8px' }}
              onClick={() => setNewlyDelivered(null)}>✕</button>
          </div>
        </div>
      )}

      <div className="mb-4">
        <Link to="/restaurant/dashboard" className="btn btn-link text-warning d-flex align-items-center gap-1 p-0 fw-bold text-decoration-none">
          <BiChevronLeft size={24} />
          <span>Back to Kitchen Dashboard</span>
        </Link>
      </div>

      <div className="mb-5 text-center">
        <h1 className="fw-bold">Orders: <span className="gradient-text">{restaurant.restaurantName}</span></h1>
        <p className="text-muted">Process orders to notify delivery partners</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-5 glass-card mx-auto" style={{ maxWidth: '500px' }}>
          <BiShoppingBag size={64} className="text-muted mb-3" />
          <h3>No Orders Yet</h3>
          <p className="text-muted">Orders will appear here in real-time once customers place them.</p>
        </div>
      ) : (
        <>
          {/* Active Orders */}
          {pendingOrders.length > 0 && (
            <div className="mb-5">
              <h3 className="fw-bold mb-4">🍳 Active Orders <span className="badge bg-warning bg-opacity-20 text-warning ms-2">{pendingOrders.length}</span></h3>
              <div className="row g-4">
                {pendingOrders.map((order) => {
                  const foodItem = foods[order.foodId] || { foodName: 'Unknown Dish' };
                  const customer = users[order.userId] || { name: 'Customer', phone: 'N/A', address: 'N/A' };
                  const deliveryBoy = order.deliveryBoyId ? deliveryBoys[order.deliveryBoyId] : null;

                  return (
                    <div className="col-12" key={order.id}>
                      <div className="glass-card p-4">
                        <div className="row g-3 align-items-center">
                          {/* Dish & Time */}
                          <div className="col-lg-4 col-md-5">
                            <div className="d-flex align-items-center gap-2 mb-2 small" style={{ color: '#ffe066' }}>
                              <BiTimeFive />
                              <span>{new Date(order.orderDate).toLocaleString()}</span>
                            </div>
                            <h4 className="fw-bold mb-1">{foodItem.foodName}</h4>
                            <p className="text-muted small mb-1">
                              Qty: <span className="fw-bold" style={{ color: '#f0f0f0' }}>{order.quantity}</span>
                              &nbsp;| Paid: <span className="fw-bold text-warning">₹{order.totalAmount?.toFixed(2)}</span>
                            </p>
                            <span className="badge" style={{
                              background: order.paymentMethod === 'COD' ? 'rgba(255,193,7,0.15)' : 'rgba(46,196,182,0.15)',
                              color: order.paymentMethod === 'COD' ? '#ffe066' : '#5ee8dc',
                              border: `1px solid ${order.paymentMethod === 'COD' ? 'rgba(255,193,7,0.3)' : 'rgba(46,196,182,0.3)'}`,
                            }}>
                              {order.paymentMethod || 'PAID'} {order.paymentStatus === 'PAID' ? '✓' : ''}
                            </span>
                          </div>

                          {/* Customer */}
                          <div className="col-lg-4 col-md-4 border-start border-secondary border-opacity-10 ps-md-4">
                            <div className="d-flex align-items-center gap-2 fw-semibold mb-2">
                              <BiUser size={18} className="text-warning" />
                              <span>{customer.name}</span>
                            </div>
                            <p className="text-muted small mb-1">📞 {customer.phone}</p>
                            <p className="text-muted small mb-0">📍 {customer.address}</p>
                            {deliveryBoy && (
                              <div className="mt-2 d-flex align-items-center gap-1" style={{ color: '#ff6b35' }}>
                                <BiCycling size={16} />
                                <small className="fw-semibold">{deliveryBoy.name} (On the way)</small>
                              </div>
                            )}
                          </div>

                          {/* Action */}
                          <div className="col-lg-4 col-md-3 border-start border-secondary border-opacity-10 ps-md-4">
                            {!order.foodProcess ? (
                              <button
                                className="btn btn-gradient w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                                onClick={() => handleProcessOrder(order.id)}
                              >
                                <BiFoodMenu size={18} />
                                <span>Accept & Process</span>
                              </button>
                            ) : order.foodProcess && !order.foodReady ? (
                              <span className="status-badge status-processing w-100 justify-content-center">
                                🍳 In Preparation
                              </span>
                            ) : order.foodReady && !order.foodPicked ? (
                              <span className="status-badge status-ready w-100 justify-content-center">
                                🍱 Ready for Pickup
                              </span>
                            ) : (
                              <span className="status-badge status-picked w-100 justify-content-center">
                                🏍️ Out for Delivery
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Completed Orders */}
          {completedOrders.length > 0 && (
            <div>
              <h3 className="fw-bold mb-4">✅ Delivered Orders <span className="badge bg-success bg-opacity-20 text-success ms-2">{completedOrders.length}</span></h3>
              <div className="row g-3">
                {completedOrders.map((order) => {
                  const foodItem = foods[order.foodId] || { foodName: 'Unknown Dish' };
                  const customer = users[order.userId] || { name: 'Customer', phone: 'N/A' };
                  const deliveryBoy = order.deliveryBoyId ? deliveryBoys[order.deliveryBoyId] : null;

                  return (
                    <div className="col-12" key={order.id}>
                      <div className="glass-card p-3" style={{ opacity: 0.85 }}>
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                          <div>
                            <span className="text-muted small">{new Date(order.orderDate).toLocaleString()}</span>
                            <h5 className="fw-bold mb-0">{foodItem.foodName}
                              <span className="text-muted fw-normal ms-2 small">× {order.quantity}</span>
                            </h5>
                            <span className="text-muted small">Customer: {customer.name}</span>
                          </div>
                          <div className="d-flex align-items-center gap-3">
                            {deliveryBoy && (
                              <span className="small" style={{ color: '#ff6b35' }}>
                                <BiCycling className="me-1" />
                                {deliveryBoy.name}
                              </span>
                            )}
                            <span className="text-warning fw-bold">₹{order.totalAmount?.toFixed(2)}</span>
                            <span className="status-badge status-delivered">✅ Delivered</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RestaurantOrders;
