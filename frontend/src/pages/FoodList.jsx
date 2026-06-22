import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { foodAPI, restaurantAPI } from '../services/api';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { BiRestaurant, BiChevronLeft, BiCartAdd, BiCheckCircle, BiPhone, BiMap } from 'react-icons/bi';

const FoodList = ({ cart, addToCart }) => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [addedItemIds, setAddedItemIds] = useState(new Set());

  useEffect(() => {
    Promise.all([
      restaurantAPI.getById(id),
      foodAPI.getByRestaurant(id)
    ])
      .then(([resRes, foodRes]) => {
        setRestaurant(resRes.data);
        setFoods(foodRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Could not fetch restaurant details or menu.');
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = (food) => {
    addToCart(food, restaurant.id);
    
    // Show added feedback
    setAddedItemIds((prev) => {
      const updated = new Set(prev);
      updated.add(food.id);
      return updated;
    });
    
    setTimeout(() => {
      setAddedItemIds((prev) => {
        const updated = new Set(prev);
        updated.delete(food.id);
        return updated;
      });
    }, 1500);
  };

  const filteredFoods = foods.filter((f) =>
    f.foodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner message="Opening the menu..." />;
  if (error || !restaurant) {
    return (
      <div className="container py-5 text-center">
        <div className="glass-card max-width-600 mx-auto py-5">
          <h3 className="text-danger">Error</h3>
          <p>{error || 'Restaurant not found.'}</p>
          <Link to="/customer/restaurants" className="btn btn-gradient mt-3">
            Back to Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="mb-4">
        <Link to="/customer/restaurants" className="btn btn-link text-warning d-flex align-items-center gap-1 p-0 fw-bold text-decoration-none">
          <BiChevronLeft size={24} />
          <span>Back to Restaurants</span>
        </Link>
      </div>

      {/* Restaurant Header */}
      <div className="glass-card mb-5 p-4 border-warning border-opacity-25">
        <div className="row align-items-center">
          <div className="col-md-8">
            <h1 className="fw-bold text-white mb-2">{restaurant.restaurantName}</h1>
            <p className="text-muted mb-3">Kitchen Managed by: <span className="text-light fw-bold">{restaurant.ownerName}</span></p>
            <div className="d-flex flex-wrap gap-4 text-muted small">
              <span className="d-flex align-items-center gap-1">
                <BiMap className="text-warning" size={16} />
                {restaurant.address}
              </span>
              <span className="d-flex align-items-center gap-1">
                <BiPhone className="text-warning" size={16} />
                {restaurant.phone}
              </span>
            </div>
          </div>
          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            <Link to="/customer/cart" className="btn btn-secondary-gradient px-4 py-2">
              Go to Cart ({cart.length})
            </Link>
          </div>
        </div>
      </div>

      <div className="text-center mb-4">
        <h2 className="fw-bold">Menu <span className="gradient-text">Items</span></h2>
      </div>

      <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search dishes by name or ingredients..." />

      {filteredFoods.length === 0 ? (
        <div className="text-center py-5 glass-card max-width-600 mx-auto mt-4">
          <BiRestaurant size={40} className="text-muted mb-3" />
          <h3>No Menu Items Available</h3>
          <p className="text-muted">This restaurant hasn't added any dishes yet or none match your search.</p>
        </div>
      ) : (
        <div className="row g-4 mt-2">
          {filteredFoods.map((food) => {
            const isAdded = addedItemIds.has(food.id);
            const isAvailable = true;
            
            return (
              <div className="col-md-6 col-lg-4" key={food.id}>
                <div className="glass-card h-100 d-flex flex-column justify-content-between p-0 overflow-hidden">
                  <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                    <img
                      src={food.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop'}
                      alt={food.foodName}
                      className="w-100 h-100 object-fit-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop';
                      }}
                    />
                    {/* availability removed — all items shown as available */}
                  </div>
                  
                  <div className="p-4 d-flex flex-column flex-grow-1 justify-content-between">
                    <div>
                      <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                        <h4 className="fw-bold text-white mb-0 fs-5">{food.foodName}</h4>
                        <span className="text-warning fw-bold fs-5">₹{food.price.toFixed(2)}</span>
                      </div>
                      <p className="text-muted small mb-4" style={{ display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {food.description || 'No description provided.'}
                      </p>
                    </div>

                    <button
                      className={`btn w-100 py-2 d-flex align-items-center justify-content-center gap-2 ${
                        isAdded ? 'btn-success' : 'btn-gradient'
                      }`}
                      onClick={() => handleAddToCart(food)}
                      disabled={!isAvailable}
                      style={!isAvailable ? { opacity: 0.5, cursor: 'not-allowed', background: 'gray', boxShadow: 'none' } : {}}
                    >
                      {isAdded ? (
                        <>
                          <BiCheckCircle size={20} />
                          <span>Added to Cart</span>
                        </>
                      ) : (
                        <>
                          <BiCartAdd size={20} />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
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

export default FoodList;
