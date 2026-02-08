const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Item = require('./models/Item');

dotenv.config();

const items = [
  // --- Electronics ---
  {
    name: "Wireless Bluetooth Headphones",
    description: "Premium noise-cancelling headphones with 30hr battery life",
    price: 12499,
    image_url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400",
    category: "Electronics",
    is_active: true
  },
  {
    name: "Smartphone Pro Max",
    description: "Latest generation smartphone with 5G and AI camera",
    price: 89999,
    image_url: "https://images.unsplash.com/photo-1592899677712-a5a254503484?w=400",
    category: "Electronics",
    is_active: true
  },
  {
    name: "4K Ultra HD Smart TV",
    description: "55-inch LED TV with built-in streaming apps",
    price: 45999,
    image_url: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400",
    category: "Electronics",
    is_active: true
  },
  {
    name: "Gaming Laptop",
    description: "High-performance laptop with RTX 4060 graphics",
    price: 114999,
    image_url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400",
    category: "Electronics",
    is_active: true
  },
  {
    name: "Smart Watch Series 7",
    description: "Fitness tracker, GPS, and health monitoring",
    price: 32999,
    image_url: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400",
    category: "Electronics",
    is_active: true
  },
  {
    name: "Digital Camera",
    description: "Mirrorless camera with 24MP sensor",
    price: 54999,
    image_url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400",
    category: "Electronics",
    is_active: true
  },
  {
    name: "Portable Power Bank",
    description: "20000mAh fast charging power bank",
    price: 2499,
    image_url: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400",
    category: "Electronics",
    is_active: true
  },
  {
    name: "Bluetooth Speaker",
    description: "Waterproof portable speaker with deep bass",
    price: 3999,
    image_url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
    category: "Electronics",
    is_active: true
  },

  // --- Fashion ---
  {
    name: "Premium Denim Jacket",
    description: "Classic fit denim jacket for all seasons",
    price: 4999,
    image_url: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400",
    category: "Fashion",
    is_active: true
  },
  {
    name: "Running Shoes",
    description: "Lightweight running shoes with foam cushioning",
    price: 7999,
    image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    category: "Fashion",
    is_active: true
  },
  {
    name: "Leather Messenger Bag",
    description: "Genuine leather bag for laptop and documents",
    price: 9999,
    image_url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400",
    category: "Fashion",
    is_active: true
  },
  {
    name: "Aviator Sunglasses",
    description: "Classic polarized aviator sunglasses",
    price: 1299,
    image_url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
    category: "Fashion",
    is_active: true
  },
  {
    name: "Cotton T-Shirt Pack",
    description: "Pack of 3 premium cotton basic tees",
    price: 1999,
    image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    category: "Fashion",
    is_active: true
  },
  {
    name: "Winter Scarf",
    description: "Soft wool blend scarf",
    price: 1499,
    image_url: "https://images.unsplash.com/photo-1606836173268-bdba4870f723?w=400",
    category: "Fashion",
    is_active: true
  },
  {
    name: "Classic Wrist Watch",
    description: "Minimalist analog watch with leather strap",
    price: 8999,
    image_url: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400",
    category: "Fashion",
    is_active: true
  },
  {
    name: "Baseball Cap",
    description: "Adjustable cotton baseball cap",
    price: 999,
    image_url: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400",
    category: "Fashion",
    is_active: true
  },

  // --- Home ---
  {
    name: "Ceramic Coffee Mug",
    description: "Handcrafted ceramic mug, dishwasher safe",
    price: 999,
    image_url: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400",
    category: "Home",
    is_active: true
  },
  {
    name: "Scented Candle",
    description: "Lavender scented soy wax candle",
    price: 1299,
    image_url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400",
    category: "Home",
    is_active: true
  },
  {
    name: "Potted Succulent",
    description: "Artificial succulent plant in white pot",
    price: 799,
    image_url: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400",
    category: "Home",
    is_active: true
  },

  // --- Books ---
  {
    name: "The Great Gatsby",
    description: "Classic novel by F. Scott Fitzgerald",
    price: 799,
    image_url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
    category: "Books",
    is_active: true
  },
  {
    name: "Clean Code",
    description: "A Handbook of Agile Software Craftsmanship",
    price: 3499,
    image_url: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400",
    category: "Books",
    is_active: true
  },
  {
    name: "Atomic Habits",
    description: "An Easy & Proven Way to Build Good Habits",
    price: 1499,
    image_url: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400",
    category: "Books",
    is_active: true
  },
  {
    name: "Sci-Fi Anthology",
    description: "Collection of best science fiction stories",
    price: 1299,
    image_url: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400",
    category: "Books",
    is_active: true
  },
  {
    name: "History of Art",
    description: "Comprehensive guide to art history",
    price: 4999,
    image_url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
    category: "Books",
    is_active: true
  },
  {
    name: "Cookbook 101",
    description: "Essential recipes for beginners",
    price: 1999,
    image_url: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400",
    category: "Books",
    is_active: true
  },
  {
    name: "Travel Guide: Japan",
    description: "Ultimate guide to traveling in Japan",
    price: 2499,
    image_url: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400",
    category: "Books",
    is_active: true
  },
  {
    name: "Mystery Novel",
    description: "Bestselling thriller mystery",
    price: 899,
    image_url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
    category: "Books",
    is_active: true
  },
  {
    name: "Note Journal",
    description: "Hardcover lined journal for writing",
    price: 599,
    image_url: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400",
    category: "Books",
    is_active: true
  },
  {
    name: "Coding for Kids",
    description: "Interactive programming book for children",
    price: 1499,
    image_url: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400",
    category: "Books",
    is_active: true
  },

  // --- Sports ---
  {
    name: "Yoga Mat",
    description: "Non-slip eco-friendly yoga mat",
    price: 1999,
    image_url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400",
    category: "Sports",
    is_active: true
  },
  {
    name: "Dumbbell Set",
    description: "Pair of 5kg adjustable dumbbells",
    price: 4999,
    image_url: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400",
    category: "Sports",
    is_active: true
  },
  {
    name: "Soccer Ball",
    description: "Size 5 official match ball",
    price: 1499,
    image_url: "https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=400",
    category: "Sports",
    is_active: true
  },
  {
    name: "Jump Rope",
    description: "Speed jump rope for cardio",
    price: 799,
    image_url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400",
    category: "Sports",
    is_active: true
  },
  {
    name: "Boxing Gloves",
    description: "Leather boxing gloves 12oz",
    price: 3999,
    image_url: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400",
    category: "Sports",
    is_active: true
  },
  {
    name: "Hiking Backpack",
    description: "40L waterproof hiking backpack",
    price: 6999,
    image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    category: "Sports",
    is_active: true
  },
  {
    name: "Swim Goggles",
    description: "Anti-fog swimming goggles",
    price: 999,
    image_url: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400",
    category: "Sports",
    is_active: true
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL || process.env.MONGO_URI);
    console.log('🔌 Connected to MongoDB');

    await Item.deleteMany({});
    console.log('🧹 Cleared existing items');

    await Item.insertMany(items);
    console.log(`🌱 Seeded ${items.length} items with Indian Prices (INR)!`);

    console.log('✅ Seeding Complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding Error:', err);
    process.exit(1);
  }
};

seedDB();
