const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const itemRoutes = require('./itemRoutes');
const cartRoutes = require('./cartRoutes');
const orderRoutes = require('./orderRoutes');

// --- Main Routes ---
// Note: We maintain the original base paths for API stability
router.use('/users', userRoutes);
router.use('/items', itemRoutes);
router.use('/carts', cartRoutes);
router.use('/orders', orderRoutes);

module.exports = router;

