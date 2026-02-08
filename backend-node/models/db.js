const mongoose = require('mongoose');
const config = require('../config');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Seed initial items if empty
    const Item = require('./Item');
    const count = await Item.countDocuments();
    if (count === 0) {
      console.log('📦 Seeding initial items...');
      const items = [
        { name: 'Wireless Bluetooth Headphones', description: 'Premium noise-cancelling headphones', price: 149.99, image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', category: 'Electronics' },
        { name: 'Smart Watch Pro', description: 'Fitness tracker with heart rate monitor', price: 299.99, image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', category: 'Electronics' },
        { name: 'Laptop Backpack', description: 'Water-resistant backpack', price: 59.99, image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', category: 'Accessories' },
        { name: 'Mechanical Keyboard', description: 'RGB gaming keyboard', price: 129.99, image_url: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400', category: 'Electronics' },
        { name: 'Wireless Mouse', description: 'Ergonomic wireless mouse', price: 49.99, image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', category: 'Electronics' },
        { name: 'USB-C Hub', description: '7-in-1 USB-C hub', price: 39.99, image_url: 'https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=400', category: 'Accessories' },
      ];
      await Item.insertMany(items);
      console.log('✅ Items seeded successfully');
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
