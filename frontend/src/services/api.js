import axios from 'axios';
import config from '../config';

// Create API instance with base URL
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

// API endpoints
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
  me: () => instance.get('/v1/users/me'),
};

export const favoriteApi = {
  toggle: async (itemId) => {
    const response = await instance.post('/users/favorites', { itemId });
    return response.data;
  },
  list: async () => {
    const response = await instance.get('/v1/users/favorites');
    return response.data;
  }
};

export const itemApi = {
  list: async (params) => {
    const response = await instance.get('/items', { params });
    return response.data; 
  },
  getCategories: async () => {
    const response = await instance.get('/v1/items/categories');
    return response.data;
  },
  get: (id) => instance.get(`/v1/items/${id}`),
};

export const cartApi = {
  add: async (itemId, quantity) => {
    const response = await instance.post('/carts', { item_id: itemId, quantity });
    return response.data;
  },
  get: async () => {
    const response = await instance.get('/v1/carts/my');
    return response.data;
  },
  updateItem: async (itemId, quantity) => {
    const response = await instance.put(`/v1/carts/items/${itemId}`, { quantity });
    return response.data;
  },
  removeItem: async (itemId) => {
    const response = await instance.delete(`/v1/carts/items/${itemId}`);
    return response.data;
  },
  clear: async () => {
    const response = await instance.delete('/v1/carts/my');
    return response.data;
  },
};

export const orderApi = {
  create: async (cartId, note) => {
    const response = await instance.post('/orders', { cart_id: cartId, note });
    return response.data;
  },
  myOrders: async () => {
    const response = await instance.get('/v1/orders/my');
    return response.data;
  },
  get: (id) => instance.get(`/v1/orders/${id}`),
  cancel: (id) => instance.post(`/v1/orders/${id}/cancel`),
};

// Aliases for compatibility
export const userApi = authApi;
export const legacyApi = instance;

export default instance;
