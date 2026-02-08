const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const itemController = require('../controllers/itemController');
const cartController = require('../controllers/cartController');
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');

// --- User Routes (Mixing legacy and v1 for compatibility) ---
// --- User Routes ---
router.post('/users', userController.register);
router.get('/users', userController.listUsers);
router.post('/users/login', userController.login);
router.post('/users/logout', auth, userController.logout);
router.post('/users/favorites', auth, userController.toggleFavorite);
router.get('/users/me', auth, userController.getMe);
router.get('/users/favorites', auth, userController.getFavorites);

// --- Item Routes ---
router.get('/items', itemController.listItems);
router.get('/items/categories', itemController.getCategories);
router.post('/items', itemController.createItem);

// --- Cart Routes ---
router.post('/carts', auth, cartController.addToCart);
router.get('/carts', auth, cartController.listAllCarts);
router.get('/carts/my', auth, cartController.getMyCart);
router.put('/carts/items/:id', auth, cartController.updateQuantity);
router.delete('/carts/items/:id', auth, cartController.removeFromCart);

// --- Order Routes ---
router.post('/orders', auth, orderController.createOrder);
router.get('/orders', auth, orderController.listAllOrders);
router.get('/orders/my', auth, orderController.getMyOrders);

module.exports = router;
