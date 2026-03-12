import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — add JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401 & refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const res = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken });
          localStorage.setItem('token', res.data.token);
          original.headers.Authorization = `Bearer ${res.data.token}`;
          return api(original);
        }
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  getMe: () => api.get('/users/me'),
};

// Materials
export const materialsAPI = {
  list: () => api.get('/materials'),
};

// Listings
export const listingsAPI = {
  create: (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, val]) => {
      if (val !== undefined && val !== null) formData.append(key, val);
    });
    return api.post('/listings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getByCurrentSeller: () => api.get('/listings/seller'),
  getBySeller: (sellerId) => api.get(`/listings/seller/${sellerId}`),
  update: (id, data) => api.patch(`/listings/${id}`, data),
};

// Pickups
export const pickupsAPI = {
  create: (data) => api.post('/pickups', data),
  getSellerPickups: () => api.get('/pickups/seller'),
  getCollectorJobs: () => api.get('/pickups/collector'),
  track: (id) => api.get(`/pickups/${id}/track`),
  getNearby: (lat, lon, radius = 50) =>
    api.get(`/pickups/nearby?lat=${lat}&lon=${lon}&radius=${radius}`),
  accept: (id) => api.post(`/pickups/${id}/accept`),
  start: (id) => api.post(`/pickups/${id}/start`),
  complete: (id, data) => api.post(`/pickups/${id}/complete`, data),
};

// Collectors
export const collectorsAPI = {
  updateLocation: (data) => api.post('/collectors/location', data),
};

// Payments
export const paymentsAPI = {
  createIntent: (data) => api.post('/payments/create-intent', data),
  getHistory: () => api.get('/payments'),
};

// Profile
export const profileAPI = {
  get: () => api.get('/users/profile'),
  update: (data) => api.put('/users/profile', data),
};

export default api;
