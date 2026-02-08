const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// --- User Routes ---
router.post('/', userController.register); // POST /users
router.get('/', userController.listUsers);    // GET /users
router.post('/login', userController.login);
router.post('/logout', auth, userController.logout);
router.get('/me', auth, userController.getMe);
router.get('/favorites', auth, userController.getFavorites);
router.post('/favorites', auth, userController.toggleFavorite);

module.exports = router;
