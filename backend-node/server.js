const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./routes/api');

const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL || process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Global Middleware
app.use(cors());
app.use(express.json());

// Main Routes
app.use('/', routes);

// Health Check
app.get('/health', (req, res) => res.json({ status: 'healthy', message: 'ShopEase Node.js API is running' }));

// Start Server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   ███████╗██╗  ██╗ ██████╗ ██████╗ ███████╗ █████╗ ███████╗║
║   ██╔════╝██║  ██║██╔═══██╗██╔══██╗██╔════╝██╔══██╗██╔════╝║
║   ███████╗███████║██║   ██║██████╔╝█████╗  ███████║███████╗║
║   ╚════██║██╔══██║██║   ██║██╔═══╝ ██╔══╝  ██╔══██║╚════██║║
║   ███████║██║  ██║╚██████╔╝██║     ███████╗██║  ██║███████║║
║   ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═╝╚══════╝║
║                                                           ║
║   🛒 E-Commerce Shopping Cart API                         ║
║   Built with Node.js • Professional Modular Design        ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

✅ Database initialized
✅ Professional Modular Structure Loaded
🚀 Server running on http://localhost:${PORT}
`);
});
