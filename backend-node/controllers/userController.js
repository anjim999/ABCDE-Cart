const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/db');
const JWT_SECRET = process.env.JWT_SECRET || 'shopease-super-secret-jwt-key-2024';

exports.register = (req, res) => {
  const { username, password, email } = req.body;
  
  if (db.data.users.find(u => u.username === username)) {
    return res.status(409).json({ success: false, error: 'Username already exists' });
  }

  const newUser = {
    id: db.data.users.length + 1,
    username,
    password: bcrypt.hashSync(password, 10),
    email: email || null,
    token: null,
    created_at: new Date().toISOString()
  };

  db.data.users.push(newUser);
  db.save();
  
  const { password: _, ...userResp } = newUser;
  res.status(201).json({ success: true, message: 'User created successfully', data: userResp });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  const user = db.data.users.find(u => u.username === username);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(400).json({ success: false, error: 'Invalid username/password' });
  }

  // Single-device enforcement
  if (user.token) {
    return res.status(403).json({ success: false, error: 'User is already logged in on another device' });
  }

  const token = jwt.sign({ user_id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
  user.token = token;
  db.save();

  const { password: _, token: __, ...userResp } = user;
  res.json({ success: true, data: { token, user: userResp } });
};

exports.logout = (req, res) => {
  const user = db.data.users.find(u => u.id === req.user.id);
  user.token = null;
  db.save();
  res.json({ success: true, message: 'Logged out successfully' });
};

exports.getMe = (req, res) => {
  const { password: _, token: __, ...userResp } = req.user;
  res.json({ success: true, data: userResp });
};

exports.listUsers = (req, res) => {
  const users = db.data.users.map(({ password, token, ...u }) => u);
  res.json({ success: true, data: users });
};
