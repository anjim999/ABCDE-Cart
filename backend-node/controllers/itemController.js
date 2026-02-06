const db = require('../models/db');

exports.listItems = (req, res) => {
  res.json({ success: true, data: db.data.items });
};

exports.getCategories = (req, res) => {
  const cats = [...new Set(db.data.items.map(i => i.category))].filter(Boolean);
  res.json({ success: true, data: cats });
};

exports.createItem = (req, res) => {
  const { name, description, price, image_url, category } = req.body;
  const newItem = {
    id: db.data.items.length + 1,
    name,
    description: description || '',
    price: parseFloat(price) || 0,
    image_url: image_url || '',
    category: category || '',
    is_active: 1,
    created_at: new Date().toISOString()
  };
  db.data.items.push(newItem);
  db.save();
  res.status(201).json({ success: true, data: newItem });
};
