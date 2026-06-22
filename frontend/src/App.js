import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CartPreview from './components/CartPreview';
import Home from './pages/Home';
import RestaurantList from './pages/RestaurantList';
import FoodList from './pages/FoodList';
import Cart from './pages/Cart';
import OrderStatus from './pages/OrderStatus';
import RestaurantDashboard from './pages/RestaurantDashboard';
import AddFood from './pages/AddFood';
import RestaurantOrders from './pages/RestaurantOrders';
import DeliveryDashboard from './pages/DeliveryDashboard';
import DeliveryLogin from './pages/DeliveryLogin';
import CustomerLogin from './pages/CustomerLogin';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminRestaurants from './pages/AdminRestaurants';
import AdminOrders from './pages/AdminOrders';
import AdminDeliveryBoys from './pages/AdminDeliveryBoys';
import AdminFood from './pages/AdminFood';

function App() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('swiggy_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('swiggy_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (food, restaurantId) => {
    // Build new cart synchronously so we can show preview with updated contents
    setCart((prevCart) => {
      let newCart = prevCart.slice();

      // If ordering from a different restaurant, clear and add new
      if (newCart.length > 0 && newCart[0].restaurantId !== restaurantId) {
        alert('Your cart was cleared because you ordered from a new restaurant.');
        newCart = [{ ...food, quantity: 1, restaurantId }];
      } else {
        const existingItem = newCart.find((item) => item.id === food.id);
        if (existingItem) {
          newCart = newCart.map((item) =>
            item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          newCart = [...newCart, { ...food, quantity: 1, restaurantId }];
        }
      }

      // show preview after updating cart (persist until dismissed)
      setShowCartPreview(true);

      return newCart;
    });
  };

  const [showCartPreview, setShowCartPreview] = useState(false);

  const updateQty = (foodId, quantity) => {
    if (quantity <= 0) {
      removeItem(foodId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === foodId ? { ...item, quantity } : item))
    );
  };

  const removeItem = (foodId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== foodId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Get total quantity of items in cart
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <Router>
      <Navbar cartCount={cartCount} />
      {showCartPreview && <CartPreview cart={cart} onClose={() => setShowCartPreview(false)} />}
      <div className="content-container">
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Customer Routes */}
          <Route path="/customer/login" element={<CustomerLogin />} />
          <Route path="/customer/restaurants" element={<RestaurantList />} />
          <Route path="/customer/menu/:id" element={<FoodList cart={cart} addToCart={addToCart} />} />
          <Route path="/customer/cart" element={<Cart cart={cart} updateQty={updateQty} removeItem={removeItem} clearCart={clearCart} />} />
          <Route path="/customer/profile" element={<OrderStatus />} />
          
          {/* Restaurant Routes */}
          <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
          <Route path="/restaurant/menu/:restaurantId" element={<AddFood />} />
          <Route path="/restaurant/orders/:restaurantId" element={<RestaurantOrders />} />
          
          {/* Delivery Routes */}
          <Route path="/delivery/login" element={<DeliveryLogin />} />
          <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/restaurants" element={<AdminRestaurants />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/delivery-boys" element={<AdminDeliveryBoys />} />
          <Route path="/admin/food" element={<AdminFood />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
