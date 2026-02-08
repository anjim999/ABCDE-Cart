import axios from 'axios';
import config from '../config';

// Create API instance with base URL
// On Vercel, apiBaseUrl will be something like https://your-api.vercel.app/api
// Locally, it will be /api (which Vite proxies to http://localhost:8080/api)
const instance = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper functions for auth management
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (e) {
    return null;
  }
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Add a request interceptor to attach the token
export const addAuthInterceptor = () => {
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid, clear local storage and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

// Apply interceptors immediately
addAuthInterceptor();

// API endpoints - All relative to baseURL (e.g., /api)
export const authApi = {
  login: async (username, password) => {
    const response = await instance.post('/users/login', { username, password });
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },
  register: async (username, password, email) => {
    const response = await instance.post('/users', { username, password, email });
    return response.data;
  },
  logout: async () => {
    try {
      await instance.post('/users/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
  me: () => instance.get('/users/me'),
};

export const favoriteApi = {
  toggle: async (itemId) => {
    const response = await instance.post('/users/favorites', { itemId });
    return response.data;
  },
  list: async () => {
    const response = await instance.get('/users/favorites');
    return response.data;
  }
};

export const itemApi = {
  list: async (params) => {
    const response = await instance.get('/items', { params });
    return response.data; 
  },
  getCategories: async () => {
    const response = await instance.get('/items/categories');
    return response.data;
  },
  get: (id) => instance.get(`/items/${id}`),
};

export const cartApi = {
  add: async (itemId, quantity) => {
    const response = await instance.post('/carts', { item_id: itemId, quantity });
    return response.data;
  },
  get: async () => {
    const response = await instance.get('/carts/my');
    return response.data;
  },
  updateItem: async (itemId, quantity) => {
    const response = await instance.put(`/carts/items/${itemId}`, { quantity });
    return response.data;
  },
  removeItem: async (itemId) => {
    const response = await instance.delete(`/carts/items/${itemId}`);
    return response.data;
  },
  clear: async () => {
    const response = await instance.delete('/carts/my');
    return response.data;
  },
};

export const orderApi = {
  create: async (cartId, note) => {
    const response = await instance.post('/orders', { cart_id: cartId, note });
    return response.data;
  },
  myOrders: async () => {
    const response = await instance.get('/orders/my');
    return response.data;
  },
  get: (id) => instance.get(`/orders/${id}`),
  cancel: (id) => instance.post(`/orders/${id}/cancel`),
};

// Aliases for compatibility
export const userApi = authApi;
export const legacyApi = instance;

export default instance;
