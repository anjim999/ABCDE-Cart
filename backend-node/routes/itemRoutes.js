const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

router.get('/', itemController.listItems);
router.get('/categories', itemController.getCategories);
router.post('/', itemController.createItem);

module.exports = router;
