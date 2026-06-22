import axios from 'axios';

const API_BASE_URL = 'http://localhost:8085';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const restaurantAPI = {
  create: (data) => api.post('/restaurant', data),
  getAll: () => api.get('/restaurant'),
  getById: (id) => api.get(`/restaurant/${id}`),
  update: (id, data) => api.put(`/restaurant/${id}`, data),
  delete: (id) => api.delete(`/restaurant/${id}`),
};

export const foodAPI = {
  create: (data) => api.post('/food', data),
  getAll: () => api.get('/food'),
  getByRestaurant: (restaurantId) => api.get(`/food/restaurant/${restaurantId}`),
  update: (id, data) => api.put(`/food/${id}`, data),
  delete: (id) => api.delete(`/food/${id}`),
};

export const userAPI = {
  create: (data) => api.post('/users', data),
  getAll: () => api.get('/users'),
  login: (phone) => api.post('/users/login', { phone }),
  delete: (id) => api.delete(`/users/${id}`),
};

export const deliveryBoyAPI = {
  register: (data) => api.post('/delivery-boys', data),
  getAll: () => api.get('/delivery-boys'),
  getById: (id) => api.get(`/delivery-boys/${id}`),
  login: (phone) => api.post('/delivery-boys/login', { phone }),
  delete: (id) => api.delete(`/delivery-boys/${id}`),
};

export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getAll: () => api.get('/orders'),
  getByUser: (userId) => api.get(`/orders/user/${userId}`),
  getByRestaurant: (restaurantId) => api.get(`/orders/restaurant/${restaurantId}`),
  getByDeliveryBoy: (deliveryBoyId) => api.get(`/orders/delivery/${deliveryBoyId}`),
  process: (id) => api.put(`/orders/process/${id}`),
  assign: (id, deliveryBoyId) => api.put(`/orders/assign/${id}?deliveryBoyId=${deliveryBoyId}`),
  pick: (id) => api.put(`/orders/picked/${id}`),
  deliver: (id) => api.put(`/orders/delivered/${id}`),
};

export const adminAPI = {
  login: (data) => api.post('/admin/login', data),
  register: (data) => api.post('/admin/register', data),
  getAll: () => api.get('/admin'),
  getById: (id) => api.get(`/admin/${id}`),
  update: (id, data) => api.put(`/admin/${id}`, data),
  delete: (id) => api.delete(`/admin/${id}`),
};

export default api;
