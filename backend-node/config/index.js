require('dotenv').config();

const config = {
  port: process.env.PORT || 8080,
  jwtSecret: process.env.JWT_SECRET || 'shopease-super-secret-jwt-key-2024',
  mongoUri: process.env.MONGODB_URL || 'mongodb://localhost:27017/shopease',
  env: process.env.NODE_ENV || 'development'
};

module.exports = config;
