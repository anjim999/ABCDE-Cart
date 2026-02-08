const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');

router.get('/', auth, orderController.listAllOrders);
router.get('/my', auth, orderController.getMyOrders);
router.post('/', auth, orderController.createOrder);

module.exports = router;
