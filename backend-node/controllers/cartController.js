const db = require('../models/db');

exports.addToCart = (req, res) => {
  const { item_id, quantity = 1 } = req.body;
  const item = db.data.items.find(i => i.id === parseInt(item_id));
  if (!item) return res.status(404).json({ success: false, error: 'Item not found' });

  let cart = db.data.carts.find(c => c.user_id === req.user.id);
  if (!cart) {
    cart = { id: db.data.carts.length + 1, user_id: req.user.id, created_at: new Date().toISOString() };
    db.data.carts.push(cart);
  }

  let cartItem = db.data.cart_items.find(ci => ci.cart_id === cart.id && ci.item_id === item.id);
  if (cartItem) {
    cartItem.quantity += quantity;
  } else {
    db.data.cart_items.push({ id: db.data.cart_items.length + 1, cart_id: cart.id, item_id: item.id, quantity });
  }

  db.save();
  res.json({ success: true, message: 'Item added to cart' });
};

exports.getMyCart = (req, res) => {
  const cart = db.data.carts.find(c => c.user_id === req.user.id);
  if (!cart) return res.json({ success: true, data: { items: [], total: 0, item_count: 0 } });

  const items = db.data.cart_items
    .filter(ci => ci.cart_id === cart.id)
    .map(ci => {
      const item = db.data.items.find(i => i.id === ci.item_id);
      return { 
        ...ci, 
        item, 
        subtotal: ci.quantity * (item ? item.price : 0) 
      };
    });

  const total = items.reduce((sum, i) => sum + i.subtotal, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  res.json({ success: true, data: { id: cart.id, items, total, item_count: itemCount } });
};

exports.removeFromCart = (req, res) => {
  db.data.cart_items = db.data.cart_items.filter(ci => ci.id !== parseInt(req.params.id));
  db.save();
  res.json({ success: true, message: 'Item removed' });
};

exports.listAllCarts = (req, res) => {
  const allCarts = db.data.carts.map(c => {
    const items = db.data.cart_items.filter(ci => ci.cart_id === c.id);
    return { ...c, items };
  });
  res.json({ success: true, data: allCarts });
};
