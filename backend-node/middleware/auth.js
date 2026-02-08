const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, error: 'Authorization header required' });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.user_id);
    
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
