const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Item = require('./models/Item');

dotenv.config();

const items = [
  {
    name: "Wireless Bluetooth Headphones",
    description: "Premium noise-cancelling headphones with 30hr battery life",
    price: 149.99,
    image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    category: "Electronics",
    is_active: true
  },
  {
    name: "Smart Watch Pro",
    description: "Fitness tracker with heart rate monitor and GPS",
    price: 299.99,
    image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    category: "Electronics",
    is_active: true
  },
  {
    name: "Laptop Backpack",
    description: "Water-resistant backpack with USB charging port",
    price: 59.99,
    image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    category: "Accessories",
    is_active: true
  },
  {
    name: "Mechanical Keyboard",
    description: "RGB gaming keyboard with Cherry MX switches",
    price: 129.99,
    image_url: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400",
    category: "Electronics",
    is_active: true
  },
  {
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with precision tracking",
    price: 49.99,
    image_url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
    category: "Electronics",
    is_active: true
  },
  {
    name: "Phone Stand",
    description: "Adjustable aluminum phone and tablet stand",
    price: 15.99,
    image_url: "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400",
    category: "Accessories",
    is_active: true
  },
  {
    name: "Smart Thermostat",
    description: "Wi-Fi enabled smart thermostat for home automation",
    price: 199.99,
    image_url: "https://images.unsplash.com/photo-1563461661026-6b2c5c9930f7?w=400",
    category: "Home",
    is_active: true
  },
  {
    name: "Gaming Headset",
    description: "Surround sound gaming headset with microphone",
    price: 89.99,
    image_url: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400",
    category: "Electronics",
    is_active: true
  },
  {
    name: "Drone Camera",
    description: "4K camera drone with stabilization",
    price: 499.99,
    image_url: "https://images.unsplash.com/photo-1507582020474-9a35b7d450d7?w=400",
    category: "Electronics",
    is_active: true
  },
  {
    name: "VR Headset",
    description: "Virtual reality headset with controllers",
    price: 399.99,
    image_url: "https://images.unsplash.com/photo-1622979135225-d2ba269fb1bd?w=400",
    category: "Electronics",
    is_active: true
  },
  {
    name: "Coffee Mug Warmer",
    description: "Electric mug warmer with auto shut-off",
    price: 24.99,
    image_url: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400",
    category: "Home",
    is_active: true
  },
  {
    name: "Notebook Set",
    description: "Premium leather-bound notebook with pen",
    price: 19.99,
    image_url: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400",
    category: "Office",
    is_active: true
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL || process.env.MONGO_URI);
    console.log('🔌 Connected to MongoDB');

    // Clear existing items
    await Item.deleteMany({});
    console.log('🧹 Cleared existing items');

    // Insert new items
    await Item.insertMany(items);
    console.log(`🌱 Seeded ${items.length} items`);

    console.log('✅ Seeding Complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding Error:', err);
    process.exit(1);
  }
};

seedDB();
