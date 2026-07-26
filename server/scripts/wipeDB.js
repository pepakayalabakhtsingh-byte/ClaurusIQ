const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
const config = require('../config/config');

const wipeDB = async () => {
  try {
    await mongoose.connect(config.db.uri || 'mongodb://127.0.0.1:27017/claurusiq');
    console.log('Connected to DB. Wiping...');
    await mongoose.connection.db.dropDatabase();
    console.log('DB Wiped successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Failed to wipe DB:', error);
    process.exit(1);
  }
};

wipeDB();
