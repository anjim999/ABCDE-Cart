const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String },
  token: { type: String, default: null }, // for single-session enforcement
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
