const Cart = require('../models/Cart');
const Item = require('../models/Item');

exports.addToCart = async (req, res) => {
  try {
    const { item_id, quantity = 1 } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Check if item exists in cart
    // Mongoose ObjectIds need comparison
    const itemIndex = cart.items.findIndex(p => p.item.toString() === item_id);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ item: item_id, quantity });
    }

    await cart.save();

    // Populate and format response to match getMyCart structure
    await cart.populate('items.item');
    const cartObj = cart.toObject({ virtuals: true });
    
    const items = cartObj.items.map(ci => ({
      id: ci._id,
      cart_id: cartObj._id,
      item_id: ci.item._id || ci.item,
      quantity: ci.quantity,
      item: ci.item,
      subtotal: (ci.item.price || 0) * ci.quantity
    }));

    const total = items.reduce((sum, i) => sum + i.subtotal, 0);
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

    res.json({ 
      success: true, 
      message: 'Item added to cart',
      data: { 
        id: cart._id, 
        items, 
        total, 
        item_count: itemCount 
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getMyCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.item');
    
    if (!cart) {
      return res.json({ success: true, data: { items: [], total: 0, item_count: 0 } });
    }

    // Calculate totals manually or rely on schema virtuals if populated
    // Mongoose virtuals work great
    const cartObj = cart.toObject({ virtuals: true });
    
    // Transform for frontend
    const items = cartObj.items.map(ci => ({
      id: ci._id,
      cart_id: cartObj._id,
      item_id: ci.item._id || ci.item, // handle potential populate fail
      quantity: ci.quantity,
      item: ci.item,
      subtotal: (ci.item.price || 0) * ci.quantity
    }));

    const total = items.reduce((sum, i) => sum + i.subtotal, 0);
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

    res.json({ 
      success: true, 
      data: { 
        id: cart._id, 
        items, 
        total, 
        item_count: itemCount 
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    // The simplified API sends a cart item ID or index. 
    // In Mongoose subdocs, we can pull by _id.
    const cartItemId = req.params.id;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) return res.status(404).json({ success: false, error: 'Cart not found' });

    cart.items.pull({ _id: cartItemId });
    await cart.save();

    res.json({ success: true, message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.listAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find().populate('items.item');
    res.json({ success: true, data: carts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
