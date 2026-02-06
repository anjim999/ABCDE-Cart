const jwt = require('jsonwebtoken');
const db = require('../models/db');
const JWT_SECRET = process.env.JWT_SECRET || 'shopease-super-secret-jwt-key-2024';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, error: 'Authorization header required' });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.data.users.find(u => u.id === decoded.user_id);
    
    if (!user || user.token !== token) {
      return res.status(401).json({ success: false, error: 'Session expired. Please login again.' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
