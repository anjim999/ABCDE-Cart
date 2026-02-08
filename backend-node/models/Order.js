const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  item_name: { type: String, required: true }, // Snapshot of name at time of order
  item_price: { type: Number, required: true }, // Snapshot of price at time of order
  quantity: { type: Number, required: true },
  subtotal: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  total_amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'confirmed' },
  note: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
