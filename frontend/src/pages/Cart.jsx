import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { BiCart, BiTrash, BiPlus, BiMinus, BiCheckCircle, BiCreditCard, BiWallet, BiMoney, BiUser } from 'react-icons/bi';

const Cart = ({ cart, updateQty, removeItem, clearCart }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Payment Modal
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('customerUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const calculateSubtotal = () => cart.reduce((t, i) => t + i.price * i.quantity, 0);
  const subtotal = calculateSubtotal();
  const deliveryFee = subtotal > 0 ? 5.0 : 0;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryFee + tax;

  const handleProceedToPayment = () => {
    setCheckoutError('');
    if (!user) {
      navigate('/customer/login', { state: { from: '/customer/cart' } });
      return;
    }
    if (cart.length === 0) {
      setCheckoutError('Your cart is empty.');
      return;
    }
    setShowPayment(true);
  };

  const handleConfirmPayment = (e) => {
    e.preventDefault();
    setPaymentError('');

    if (paymentMethod === 'CARD') {
      if (!cardName || !cardNumber || !cardCvv) {
        setPaymentError('Please fill in all card details.');
        return;
      }
      if (cardNumber.replace(/\s/g, '').length < 16) {
        setPaymentError('Please enter a valid 16-digit card number.');
        return;
      }
    }
    if (paymentMethod === 'UPI' && !upiId) {
      setPaymentError('Please enter your UPI ID.');
      return;
    }

    setCheckingOut(true);
    const orderPromises = cart.map((item) => {
      const orderData = {
        userId: parseInt(user.id),
        restaurantId: item.restaurantId,
        foodId: item.id,
        quantity: item.quantity,
        totalAmount: item.price * item.quantity,
        paymentMethod: paymentMethod,
        paymentStatus: 'PAID',
      };
      return orderAPI.create(orderData);
    });

    Promise.all(orderPromises)
      .then(() => {
        clearCart();
        setCheckingOut(false);
        setShowPayment(false);
        setOrderSuccess(true);
        setTimeout(() => {
          navigate('/customer/profile');
        }, 3000);
      })
      .catch(() => {
        setPaymentError('Payment processing failed. Please try again.');
        setCheckingOut(false);
      });
  };

  if (orderSuccess) {
    return (
      <div className="container py-5 text-center">
        <div className="glass-card mx-auto py-5" style={{ maxWidth: '500px' }}>
          <div style={{ fontSize: '5rem' }} className="mb-3">🎉</div>
          <h2 className="fw-bold gradient-text mb-2">Order Placed!</h2>
          <p className="text-muted mb-1">Your payment was successful.</p>
          <p className="text-muted">Redirecting to your profile dashboard...</p>
          <div className="spinner-border text-warning mt-3" role="status" />
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="glass-card mx-auto py-5" style={{ maxWidth: '500px' }}>
          <BiCart size={80} className="text-muted mb-3" />
          <h2 className="fw-bold">Your Cart is Empty</h2>
          <p className="text-muted">Browse restaurants to add delicious items.</p>
          <Link to="/customer/restaurants" className="btn btn-gradient mt-3">Browse Restaurants</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="fw-bold mb-4">Checkout <span className="gradient-text">Basket</span></h1>

      <div className="row g-4">
        {/* Cart Items */}
        <div className="col-lg-8">
          <div className="glass-card mb-4">
            <h3 className="h4 fw-bold mb-3">Selected Dishes</h3>
            <div className="table-responsive">
              <table className="table table-dark-glass mb-0">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th className="text-center" style={{ width: '120px' }}>Qty</th>
                    <th className="text-end">Price</th>
                    <th className="text-end" style={{ width: '60px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop'}
                            alt={item.foodName}
                            style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }}
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop'; }}
                          />
                          <div>
                            <span className="fw-bold d-block">{item.foodName}</span>
                            <span className="text-muted small">₹{item.price.toFixed(2)} each</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          <button className="btn btn-sm p-1 border-0" onClick={() => updateQty(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                            <BiMinus size={16} className="text-warning" />
                          </button>
                          <span className="fw-bold">{item.quantity}</span>
                          <button className="btn btn-sm p-1 border-0" onClick={() => updateQty(item.id, item.quantity + 1)}>
                            <BiPlus size={16} className="text-warning" />
                          </button>
                        </div>
                      </td>
                      <td className="text-end fw-bold">₹{(item.price * item.quantity).toFixed(2)}</td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-danger border-0 p-1" onClick={() => removeItem(item.id)}>
                          <BiTrash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Customer Profile */}
          <div className="glass-card">
            <h3 className="h4 fw-bold mb-3">Customer Profile</h3>
            {checkoutError && <div className="alert alert-danger py-2 mb-3">{checkoutError}</div>}
            
            {user ? (
              <div className="p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="d-flex align-items-center gap-3">
                  <BiUser size={32} className="text-warning" />
                  <div>
                    <h5 className="fw-bold mb-0">{user.name}</h5>
                    <span className="text-muted small">📞 {user.phone}</span>
                    <span className="d-block text-muted small mt-1">📍 Delivery to: {user.address}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted mb-3">You need to log in to place an order.</p>
                <Link to="/customer/login" state={{ from: '/customer/cart' }} className="btn btn-outline-warning">
                  <BiUser className="me-2" />Log in or Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Price Summary */}
        <div className="col-lg-4">
          <div className="glass-card">
            <h3 className="h4 fw-bold mb-4">Summary</h3>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Subtotal</span><span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Delivery Fee</span><span>₹{deliveryFee.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted">GST (5%)</span><span>₹{tax.toFixed(2)}</span>
            </div>
            <hr className="border-secondary opacity-25" />
            <div className="d-flex justify-content-between fw-bold fs-5 mb-4">
              <span>Total</span>
              <span className="gradient-text">₹{total.toFixed(2)}</span>
            </div>
            
            {!user ? (
              <button
                className="btn btn-secondary w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                onClick={handleProceedToPayment}
              >
                <BiUser size={20} />
                <span>Log in to Checkout</span>
              </button>
            ) : (
              <button
                className="btn btn-gradient w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                onClick={handleProceedToPayment}
              >
                <BiCheckCircle size={20} />
                <span>Proceed to Payment</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
          zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(6px)'
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold mb-0">💳 Payment</h3>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowPayment(false)}>✕</button>
            </div>

            <div className="mb-3 p-3 rounded-3" style={{ background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.2)' }}>
              <div className="d-flex justify-content-between fw-bold">
                <span>Amount to Pay</span>
                <span className="gradient-text fs-5">₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-4">
              <label className="form-label fw-bold mb-3">Select Payment Method</label>
              <div className="d-flex gap-2">
                {[
                  { id: 'UPI', label: 'UPI', icon: <BiWallet size={20} /> },
                  { id: 'CARD', label: 'Card', icon: <BiCreditCard size={20} /> },
                  { id: 'COD', label: 'Cash on Delivery', icon: <BiMoney size={20} /> },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className={`btn flex-fill py-3 d-flex flex-column align-items-center gap-1 ${paymentMethod === m.id ? 'btn-gradient' : 'btn-outline-secondary'}`}
                    onClick={() => setPaymentMethod(m.id)}
                  >
                    {m.icon}
                    <small>{m.label}</small>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleConfirmPayment}>
              {paymentError && <div className="alert alert-danger py-2 mb-3">{paymentError}</div>}

              {paymentMethod === 'CARD' && (
                <div className="row g-3 mb-3">
                  <div className="col-12">
                    <label className="form-label">Cardholder Name</label>
                    <input type="text" className="form-control glass-input" placeholder="John Doe" value={cardName} onChange={(e) => setCardName(e.target.value)} />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Card Number</label>
                    <input type="text" className="form-control glass-input" placeholder="1234 5678 9012 3456" maxLength={19}
                      value={cardNumber}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, '').slice(0, 16);
                        setCardNumber(v.replace(/(.{4})/g, '$1 ').trim());
                      }}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label">Expiry (MM/YY)</label>
                    <input type="text" className="form-control glass-input" placeholder="12/27" maxLength={5} />
                  </div>
                  <div className="col-6">
                    <label className="form-label">CVV</label>
                    <input type="password" className="form-control glass-input" placeholder="•••" maxLength={3} value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} />
                  </div>
                </div>
              )}

              {paymentMethod === 'UPI' && (
                <div className="mb-3">
                  <label className="form-label">UPI ID</label>
                  <input type="text" className="form-control glass-input" placeholder="yourname@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
                  <small className="text-muted mt-1 d-block">e.g. 9876543210@paytm or name@gpay</small>
                </div>
              )}

              {paymentMethod === 'COD' && (
                <div className="mb-3 p-3 rounded-3 text-center" style={{ background: 'rgba(255,193,7,0.08)', border: '1px solid rgba(255,193,7,0.2)' }}>
                  <p className="mb-0 text-warning">💵 Pay ₹{total.toFixed(2)} in cash when your order arrives.</p>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-gradient w-100 py-3 mt-2"
                disabled={checkingOut}
              >
                {checkingOut ? (
                  <><span className="spinner-border spinner-border-sm me-2" />Processing...</>
                ) : (
                  <><BiCheckCircle size={20} className="me-2" />
                    {paymentMethod === 'COD' ? 'Place Order (Pay on Delivery)' : `Pay ₹${total.toFixed(2)}`}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
