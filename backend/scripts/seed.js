// ─────────────────────────────────────────────
// SparkleWash — Seed Script
// Creates the default admin user if not present
// Run: node scripts/seed.js
// ─────────────────────────────────────────────

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const existing = await User.findOne({ email: 'admin@demo.com' });
    if (existing) {
      console.log('ℹ️  Admin user already exists. Skipping seed.');
    } else {
      await User.create({
        name: 'Admin User',
        email: 'admin@demo.com',
        phone: '+91 98765 43210',
        password: 'admin123',
        role: 'admin',
      });
      console.log('✅ Admin user created: admin@demo.com / admin123');
    }
  } catch (err) {
    console.error('Seed error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seed();
