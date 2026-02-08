const config = {
  apiBaseUrl: import.meta.env.VITE_API_URL || '/api',
  auth: {
    tokenKey: 'token',
    userKey: 'user'
  }
};

export default config;
