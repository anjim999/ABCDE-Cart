import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Also create instance for legacy routes (without /api/v1 prefix)
const legacyApi = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
const addAuthInterceptor = (instance) => {
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

  // Response interceptor to handle auth errors
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid, clear it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
      }
      return Promise.reject(error);
    }
  );
};

addAuthInterceptor(api);
addAuthInterceptor(legacyApi);

// ==================
// User API
// ==================

export const userApi = {
  // Create new user
  register: async (username, password, email = '') => {
    const response = await legacyApi.post('/users', { username, password, email });
    return response.data;
  },

  // Login user
  login: async (username, password) => {
    const response = await legacyApi.post('/users/login', { username, password });
    if (response.data.success && response.data.data?.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Logout user
  logout: async () => {
    try {
      await legacyApi.post('/users/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // List all users
  list: async () => {
    const response = await legacyApi.get('/users');
    return response.data;
  },

  // Get current user
  me: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
};

// ==================
// Item API
// ==================

export const itemApi = {
  // List all items
  list: async (page = 1, pageSize = 20, category = '') => {
    let url = `/items?page=${page}&page_size=${pageSize}`;
    if (category) {
      url += `&category=${encodeURIComponent(category)}`;
    }
    const response = await legacyApi.get(url);
    return response.data;
  },

  // Get single item
  get: async (id) => {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },

  // Create item
  create: async (itemData) => {
    const response = await legacyApi.post('/items', itemData);
    return response.data;
  },

  // Get categories
  categories: async () => {
    const response = await api.get('/items/categories');
    return response.data;
  },
};

// ==================
// Cart API
// ==================

export const cartApi = {
  // Add item to cart
  add: async (itemId, quantity = 1) => {
    const response = await legacyApi.post('/carts', { item_id: itemId, quantity });
    return response.data;
  },

  // Get my cart
  get: async () => {
    const response = await api.get('/carts/my');
    return response.data;
  },

  // List all carts
  list: async () => {
    const response = await legacyApi.get('/carts');
    return response.data;
  },

  // Update cart item quantity
  updateItem: async (cartItemId, quantity) => {
    const response = await api.put(`/carts/items/${cartItemId}`, { quantity });
    return response.data;
  },

  // Remove item from cart
  removeItem: async (cartItemId) => {
    const response = await api.delete(`/carts/items/${cartItemId}`);
    return response.data;
  },

  // Clear cart
  clear: async () => {
    const response = await api.delete('/carts/my');
    return response.data;
  },
};

// ==================
// Order API
// ==================

export const orderApi = {
  // Create order from cart
  create: async (cartId, note = '') => {
    const response = await legacyApi.post('/orders', { cart_id: cartId, note });
    return response.data;
  },

  // Get my orders
  myOrders: async () => {
    const response = await api.get('/orders/my');
    return response.data;
  },

  // List all orders
  list: async (page = 1, pageSize = 20) => {
    const response = await legacyApi.get(`/orders?page=${page}&page_size=${pageSize}`);
    return response.data;
  },

  // Get order details
  get: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Cancel order
  cancel: async (id) => {
    const response = await api.post(`/orders/${id}/cancel`);
    return response.data;
  },
};

// Helper to check if user is logged in
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Helper to get current user
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export default {
  userApi,
  itemApi,
  cartApi,
  orderApi,
  isAuthenticated,
  getCurrentUser,
};
