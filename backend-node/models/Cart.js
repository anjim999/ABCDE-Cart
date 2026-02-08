const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  quantity: { type: Number, required: true, default: 1 }
});

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema]
}, { timestamps: true });

// Virtual for total price
cartSchema.virtual('total').get(function() {
  if (!this.items) return 0;
  return this.items.reduce((total, cartItem) => {
    return total + (cartItem.item.price * cartItem.quantity);
  }, 0);
});

cartSchema.virtual('item_count').get(function() {
  if (!this.items) return 0;
  return this.items.reduce((total, cartItem) => total + cartItem.quantity, 0);
});

cartSchema.set('toObject', { virtuals: true });
cartSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Cart', cartSchema);
