const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const config = require('../config');

exports.register = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ success: false, error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hashedPassword,
      email
    });

    const userResp = user.toObject();
    delete userResp.password;
    delete userResp.token;

    res.status(201).json({ success: true, message: 'User created successfully', data: userResp });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ success: false, error: 'Invalid username/password' });
    }

    // Single-device enforcement
    // In real-world, we might check if token is expired, but assignment implies strict check
    if (user.token) {
        // Optional: you can verify if the token is actually valid/unexpired before rejecting
        try {
            jwt.verify(user.token, config.jwtSecret);
            return res.status(403).json({ success: false, error: 'User is already logged in on another device' });
        } catch (e) {
            // Token expired, allow login
        }
    }

    const token = jwt.sign({ user_id: user._id, username: user.username }, config.jwtSecret, { expiresIn: '24h' });
    
    user.token = token;
    await user.save();

    const userResp = user.toObject();
    delete userResp.password;
    delete userResp.token;

    res.json({ success: true, data: { token, user: userResp } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.token = null;
      await user.save();
    }
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getMe = async (req, res) => {
  const userResp = req.user.toObject();
  delete userResp.password;
  delete userResp.token;
  res.json({ success: true, data: userResp });
};

exports.listUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password -token');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
