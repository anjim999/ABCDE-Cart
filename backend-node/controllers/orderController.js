const db = require('../models/db');

exports.createOrder = (req, res) => {
  const { cart_id } = req.body;
  const cart = db.data.carts.find(c => c.id === parseInt(cart_id) && c.user_id === req.user.id);
  
  if (!cart) return res.status(404).json({ success: false, error: 'Cart not found' });

  const cartItems = db.data.cart_items.filter(ci => ci.cart_id === cart.id);
  if (cartItems.length === 0) return res.status(400).json({ success: false, error: 'Cart is empty' });

  const itemDetails = cartItems.map(ci => {
    const item = db.data.items.find(i => i.id === ci.item_id);
    return { 
      item_id: ci.item_id, 
      item_name: item.name, 
      item_price: item.price, 
      quantity: ci.quantity,
      subtotal: ci.quantity * item.price 
    };
  });

  const total = itemDetails.reduce((sum, i) => sum + i.subtotal, 0);
  const orderId = db.data.orders.length + 1;
  const order = { 
    id: orderId, 
    user_id: req.user.id, 
    total_amount: total, 
    status: 'confirmed', 
    created_at: new Date().toISOString() 
  };
  
  itemDetails.forEach(detail => {
    db.data.order_items.push({ id: db.data.order_items.length + 1, order_id: orderId, ...detail });
  });

  db.data.orders.push(order);
  db.data.cart_items = db.data.cart_items.filter(ci => ci.cart_id !== cart.id); // Clear cart
  db.save();

  res.status(201).json({ success: true, message: 'Order placed successfully', data: order });
};

exports.getMyOrders = (req, res) => {
  const orders = db.data.orders
    .filter(o => o.user_id === req.user.id)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json({ success: true, data: orders });
};

exports.listAllOrders = (req, res) => {
  res.json({ success: true, data: db.data.orders });
};
