const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const resetTokens = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL || process.env.MONGO_URI);
    console.log('🔌 Connected to MongoDB');

    // Clear tokens for ALL users
    const result = await User.updateMany({}, { $set: { token: null } });
    
    console.log(`✅ Cleared sessions for ${result.modifiedCount} users.`);
    console.log('🔓 You can now log in freely!');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error resetting tokens:', err);
    process.exit(1);
  }
};

resetTokens();
