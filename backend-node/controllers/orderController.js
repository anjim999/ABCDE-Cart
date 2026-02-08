const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.createOrder = async (req, res) => {
  try {
    const { cart_id } = req.body;
    
    // Validate cart ownership
    const cart = await Cart.findOne({ _id: cart_id, user: req.user._id }).populate('items.item');
    
    if (!cart) return res.status(404).json({ success: false, error: 'Cart not found' });
    if (cart.items.length === 0) return res.status(400).json({ success: false, error: 'Cart is empty' });

    // Snapshot items
    const orderItems = cart.items.map(ci => ({
      item: ci.item._id,
      item_name: ci.item.name,
      item_price: ci.item.price,
      quantity: ci.quantity,
      subtotal: ci.quantity * ci.item.price
    }));

    const total = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      total_amount: total,
      status: 'confirmed'
    });

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({ success: true, message: 'Order placed successfully', data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    
    // Add item_count convenience field
    const ordersWithCount = orders.map(o => {
      const doc = o.toObject();
      doc.item_count = doc.items.reduce((sum, i) => sum + i.quantity, 0);
      doc.id = doc._id;
      return doc;
    });

    res.json({ success: true, data: ordersWithCount });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.listAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
