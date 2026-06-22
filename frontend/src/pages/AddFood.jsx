import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { foodAPI, restaurantAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { BiChevronLeft, BiPlus, BiEditAlt, BiTrash, BiCheck, BiRefresh } from 'react-icons/bi';

const AddFood = () => {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State (Add / Edit Mode)
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    Promise.all([
      restaurantAPI.getById(restaurantId),
      foodAPI.getByRestaurant(restaurantId)
    ])
      .then(([restRes, foodsRes]) => {
        setRestaurant(restRes.data);
        setFoods(foodsRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load restaurant details or menu.');
        setLoading(false);
      });
  }, [restaurantId]);

  const loadMenu = () => {
    foodAPI.getByRestaurant(restaurantId)
      .then((res) => setFoods(res.data))
      .catch((err) => console.error(err));
  };

  const handleResetForm = () => {
    setEditId(null);
    setName('');
    setDesc('');
    setPrice('');
    setImgUrl('');
    setFormError('');
    setFormError('');
  };

  const handleEditClick = (food) => {
    setEditId(food.id);
    setName(food.foodName);
    setDesc(food.description);
    setPrice(food.price.toString());
    setImgUrl(food.imageUrl || '');
    setFormError('');
    setFormSuccess('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!name || !price) {
      setFormError('Food name and price are required.');
      return;
    }

    const priceVal = parseFloat(price);
    if (isNaN(priceVal) || priceVal <= 0) {
      setFormError('Please enter a valid price greater than 0.');
      return;
    }

    const foodData = {
      foodName: name,
      description: desc,
      price: priceVal,
      imageUrl: imgUrl,
      available: true,
      restaurantId: parseInt(restaurantId)
    };

    const action = editId 
      ? foodAPI.update(editId, foodData)
      : foodAPI.create(foodData);

    action
      .then(() => {
        setFormSuccess(editId ? 'Dish updated successfully!' : 'Dish added to menu!');
        handleResetForm();
        loadMenu();
      })
      .catch((err) => {
        console.error(err);
        setFormError('Failed to save food item details.');
      });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this item from your menu?')) {
      foodAPI.delete(id)
        .then(() => {
          loadMenu();
        })
        .catch((err) => {
          console.error(err);
          alert('Error deleting food item.');
        });
    }
  };

  if (loading) return <LoadingSpinner message="Opening kitchen cabinets..." />;

  if (error || !restaurant) {
    return (
      <div className="container py-5 text-center">
        <div className="glass-card max-width-600 mx-auto py-5">
          <h3 className="text-danger">Error</h3>
          <p>{error || 'Restaurant details could not be loaded.'}</p>
          <Link to="/restaurant/dashboard" className="btn btn-gradient mt-3">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="mb-4">
        <Link to="/restaurant/dashboard" className="btn btn-link text-warning d-flex align-items-center gap-1 p-0 fw-bold text-decoration-none">
          <BiChevronLeft size={24} />
          <span>Back to Kitchen Dashboard</span>
        </Link>
      </div>

      <div className="mb-5 text-center">
        <h1 className="fw-bold">Manage Menu: <span className="gradient-text">{restaurant && restaurant.restaurantName ? restaurant.restaurantName : `Restaurant #${restaurantId}`}</span></h1>
        <p className="text-muted">Manage the dishes served by your kitchen</p>
      </div>

      <div className="row g-4">
        {/* Add/Edit Food Form */}
        <div className="col-lg-5">
          <div className="glass-card">
            <h3 className="h4 fw-bold text-white mb-4">
              {editId ? 'Edit Dish Details' : 'Add New Dish'}
            </h3>

            <form onSubmit={handleSubmit} className="row g-3">
              {formError && <div className="col-12 alert alert-danger py-2">{formError}</div>}
              {formSuccess && <div className="col-12 alert alert-success py-2">{formSuccess}</div>}

              <div className="col-12">
                <label className="form-label text-muted small fw-bold">Dish Name</label>
                <input
                  type="text"
                  className="form-control glass-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Classic Margherita Pizza"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-muted small fw-bold">Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control glass-input"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="12.99"
                  required
                />
              </div>

              

              <div className="col-12">
                <label className="form-label text-muted small fw-bold">Image URL (Optional)</label>
                <input
                  type="url"
                  className="form-control glass-input"
                  value={imgUrl}
                  onChange={(e) => setImgUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="col-12">
                <label className="form-label text-muted small fw-bold">Description / Ingredients</label>
                <textarea
                  className="form-control glass-input"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="San Marzano tomatoes, fresh mozzarella, fresh basil, extra virgin olive oil."
                  rows="3"
                ></textarea>
              </div>

              <div className="col-12 d-flex gap-2 justify-content-end mt-4">
                {editId && (
                  <button type="button" className="btn btn-outline-secondary px-3" onClick={handleResetForm}>
                    Cancel Edit
                  </button>
                )}
                <button type="submit" className="btn btn-gradient px-4">
                  {editId ? 'Update Item' : 'Add to Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Food List Table */}
        <div className="col-lg-7">
          <div className="glass-card">
            <h3 className="h4 fw-bold text-white mb-4">Current Menu</h3>

            {foods.length === 0 ? (
              <p className="text-muted text-center py-4">No dishes listed on your menu yet. Add one using the form!</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-dark-glass text-white mb-0">
                  <thead>
                    <tr>
                      <th>Preview</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {foods.map((food) => (
                      <tr key={food.id}>
                        <td>
                          <img
                            src={food.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop'}
                            alt={food.foodName}
                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }}
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop';
                            }}
                          />
                        </td>
                        <td>
                          <span className="fw-semibold d-block">{food.foodName}</span>
                          <span className="text-muted small d-inline-block text-truncate" style={{ maxWidth: '180px' }}>
                            {food.description || 'No description'}
                          </span>
                        </td>
                        <td className="fw-bold text-warning">₹{food.price.toFixed(2)}</td>
                        <td>
                          <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-50">In Stock</span>
                        </td>
                        <td className="text-end">
                          <div className="d-flex justify-content-end gap-1">
                            <button
                              className="btn btn-sm btn-outline-warning border-0 p-1"
                              onClick={() => handleEditClick(food)}
                            >
                              <BiEditAlt size={18} />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger border-0 p-1"
                              onClick={() => handleDelete(food.id)}
                            >
                              <BiTrash size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFood;
