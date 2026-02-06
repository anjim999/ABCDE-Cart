const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../db.json');

class JsonDB {
  constructor() {
    this.data = {
      users: [],
      items: [],
      carts: [],
      cart_items: [],
      orders: [],
      order_items: []
    };
    this.load();
    if (this.data.items.length === 0) this.seed();
  }

  load() {
    if (fs.existsSync(DB_FILE)) {
      try {
        this.data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      } catch (e) {
        console.error('Error loading DB, reset to empty');
      }
    }
  }

  save() {
    fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2));
  }

  seed() {
    console.log('📦 Seeding initial items...');
    this.data.items = [
      { id: 1, name: 'Wireless Bluetooth Headphones', description: 'Premium noise-cancelling headphones', price: 149.99, image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', category: 'Electronics', is_active: 1 },
      { id: 2, name: 'Smart Watch Pro', description: 'Fitness tracker with heart rate monitor', price: 299.99, image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', category: 'Electronics', is_active: 1 },
      { id: 3, name: 'Laptop Backpack', description: 'Water-resistant backpack', price: 59.99, image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', category: 'Accessories', is_active: 1 },
      { id: 4, name: 'Mechanical Keyboard', description: 'RGB gaming keyboard', price: 129.99, image_url: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400', category: 'Electronics', is_active: 1 },
      { id: 5, name: 'Wireless Mouse', description: 'Ergonomic wireless mouse', price: 49.99, image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', category: 'Electronics', is_active: 1 },
      { id: 6, name: 'USB-C Hub', description: '7-in-1 USB-C hub', price: 39.99, image_url: 'https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=400', category: 'Accessories', is_active: 1 },
    ];
    this.save();
  }
}

module.exports = new JsonDB();
