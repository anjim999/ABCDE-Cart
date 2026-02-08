const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middleware/auth');

router.get('/', auth, cartController.listAllCarts);
router.get('/my', auth, cartController.getMyCart);
router.post('/', auth, cartController.addToCart);
router.put('/items/:id', auth, cartController.updateQuantity);
router.delete('/items/:id', auth, cartController.removeFromCart);

module.exports = router;
