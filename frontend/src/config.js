const config = {
  apiBaseUrl: import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api` 
    : '/api',
  auth: {
    tokenKey: 'token',
    userKey: 'user'
  }
};

export default config;
