import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { restaurantAPI } from '../services/api';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { BiRestaurant, BiMap, BiPhone, BiArrowToRight } from 'react-icons/bi';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    restaurantAPI.getAll()
      .then((res) => {
        setRestaurants(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Could not load restaurants. Make sure the backend is running.');
        setLoading(false);
      });
  }, []);

  const filteredRestaurants = restaurants.filter((r) =>
    r.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner message="Locating nearby kitchens..." />;

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold display-5">Popular <span className="gradient-text">Restaurants</span></h1>
        <p className="text-muted">Browse meals from your favorite restaurants</p>
      </div>

      <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search by restaurant name or location..." />

      {error && (
        <div className="alert alert-danger glass-card border-danger text-center max-width-600 mx-auto my-4" role="alert">
          {error}
        </div>
      )}

      {!error && filteredRestaurants.length === 0 ? (
        <div className="text-center py-5 glass-card max-width-600 mx-auto mt-4">
          <BiRestaurant size={50} className="text-warning mb-3" />
          <h3>No Restaurants Found</h3>
          <p className="text-muted">Try listing a new restaurant in the Restaurant Portal first!</p>
          <Link to="/restaurant/dashboard" className="btn btn-gradient mt-2">
            Go to Restaurant Portal
          </Link>
        </div>
      ) : (
        <div className="row g-4 mt-2">
          {filteredRestaurants.map((res) => (
            <div className="col-lg-4 col-md-6" key={res.id}>
              <div className="glass-card h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="p-3 bg-warning bg-opacity-10 rounded-circle text-warning">
                      <BiRestaurant size={26} />
                    </div>
                    <div>
                      <h4 className="fw-bold mb-0 text-white">{res.restaurantName}</h4>
                      <span className="text-muted small">Owner: {res.ownerName}</span>
                    </div>
                  </div>

                  <p className="text-muted small d-flex align-items-center gap-2 mb-2">
                    <BiMap className="text-warning" size={16} />
                    {res.address}
                  </p>
                  <p className="text-muted small d-flex align-items-center gap-2 mb-3">
                    <BiPhone className="text-warning" size={16} />
                    {res.phone}
                  </p>
                </div>

                <Link to={`/customer/menu/${res.id}`} className="btn btn-gradient w-100 mt-4 d-flex align-items-center justify-content-center gap-2">
                  <span>View Menu</span>
                  <BiArrowToRight size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantList;
