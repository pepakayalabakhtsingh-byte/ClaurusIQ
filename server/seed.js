const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const config = require('./config/config');

// Connect to MongoDB
mongoose.connect(config.db.uri)
  .then(() => console.log('✅ MongoDB Connected for Seeding'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

const seedUsers = async () => {
  try {
    // Clear existing users to prevent duplicates if testing
    await User.deleteMany();
    console.log('🗑️  Cleared existing users');

    // We MUST use .create() or .save() so the pre-save hook hashes the password!
    await User.create([
      {
        name: 'Admin User',
        email: 'admin@claurusiq.com',
        password: 'password123',
        role: 'admin',
        accountStatus: 'active'
      },
      {
        name: 'Researcher User',
        email: 'researcher@claurusiq.com',
        password: 'password123',
        role: 'researcher',
        accountStatus: 'active'
      },
      {
        name: 'Test Viewer',
        email: 'viewer@claurusiq.com',
        password: 'password123',
        role: 'viewer',
        accountStatus: 'active'
      }
    ]);

    console.log('🌱 Successfully seeded 3 users: admin, researcher, viewer');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedUsers();
