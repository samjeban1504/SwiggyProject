import React from 'react';
import { Link } from 'react-router-dom';

const CartPreview = ({ cart, onClose }) => {
  const total = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.card} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h5 style={{ margin: 0 }}>Cart</h5>
          <button onClick={onClose} style={styles.closeBtn} aria-label="Close">✕</button>
        </div>
        <div style={styles.list}>
          {cart.length === 0 ? (
            <p style={{ margin: 0 }}>Cart is empty</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} style={styles.item}>
                <div style={styles.imageWrapper}>
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop'}
                    alt={item.name || item.title || 'Cart item'}
                    style={styles.itemImage}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop'; }}
                  />
                </div>
                <div style={styles.itemDetails}>
                  <div style={{ fontWeight: 700 }}>{item.name || item.restaurantName || item.title}</div>
                  <div style={{ color: '#555', marginTop: 4 }}>{item.quantity} × ₹{(item.price || 0).toFixed(2)}</div>
                </div>
              </div>
            ))
          )}
        </div>
        <div style={styles.footer}>
          <div style={{ fontWeight: 700 }}>Total: ₹{total.toFixed(2)}</div>
          <Link to="/customer/cart" style={styles.viewBtn} onClick={onClose}>View Cart</Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    bottom: 20,
    right: 20,
    zIndex: 1100,
  },
  card: {
    width: 320,
    background: '#fff',
    color: '#000',
    borderRadius: 12,
    boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid #eee',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    fontSize: 16,
    cursor: 'pointer',
  },
  list: {
    maxHeight: 220,
    overflowY: 'auto',
    padding: '12px 16px',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px dashed #f0f0f0',
  },
  imageWrapper: {
    flexShrink: 0,
    width: 52,
    height: 52,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
    background: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  itemDetails: {
    flex: 1,
    minWidth: 0,
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderTop: '1px solid #eee',
  },
  viewBtn: {
    padding: '8px 12px',
    background: 'linear-gradient(135deg,#f97316 0%,#ea580c 100%)',
    color: '#1a0a00',
    borderRadius: 8,
    textDecoration: 'none',
    fontWeight: 700,
  },
};

export default CartPreview;
