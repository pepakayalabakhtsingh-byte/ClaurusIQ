const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  db: {
    uri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ClaurusIQ',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'claurusiq_default_secret_key_change_me_in_prod',
    expire: process.env.JWT_EXPIRE || '30d',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  },
  providers: {
    gemini: {
      apiKey: process.env.GEMINI_API_KEY,
    }
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  }
};

module.exports = config;
