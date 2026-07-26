const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config({ path: '../.env' });
const config = require('../config/config');

const seedDB = async () => {
  try {
    await mongoose.connect(config.db.uri || 'mongodb://127.0.0.1:27017/claurusiq');
    
    // Clear existing users just in case
    await User.deleteMany({});

    await User.create([
      {
        name: 'Standard User',
        email: 'user@claurusiq.com',
        password: 'password123',
        role: 'user',
        accountStatus: 'active'
      },
      {
        name: 'Platform Admin',
        email: 'admin@claurusiq.com',
        password: 'password123',
        role: 'admin',
        accountStatus: 'active'
      }
    ]);
    
    console.log('Seed completed: Created user@claurusiq.com and admin@claurusiq.com');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seedDB();
