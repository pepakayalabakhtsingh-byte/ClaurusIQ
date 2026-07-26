const Redis = require('ioredis');
const config = require('../../config/config');
const logger = require('../../config/logger');

const redisClient = new Redis(config.redis.url);

redisClient.on('error', (err) => {
  logger.error(`Redis Cache error: ${err.message}`);
});

/**
 * Get data from cache
 * @param {string} key 
 */
const getCache = async (key) => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error(`Cache Get Error: ${error.message}`);
    return null;
  }
};

/**
 * Set data to cache
 * @param {string} key 
 * @param {any} value 
 * @param {number} ttl - Time to live in seconds (default 3600s = 1h)
 */
const setCache = async (key, value, ttl = 3600) => {
  try {
    await redisClient.set(key, JSON.stringify(value), 'EX', ttl);
  } catch (error) {
    logger.error(`Cache Set Error: ${error.message}`);
  }
};

/**
 * Delete a specific key
 * @param {string} key 
 */
const delCache = async (key) => {
  try {
    await redisClient.del(key);
  } catch (error) {
    logger.error(`Cache Delete Error: ${error.message}`);
  }
};

/**
 * Express Middleware for caching routes
 * @param {number} ttl 
 */
const cacheMiddleware = (ttl = 300) => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') return next();

    const key = `cache:${req.originalUrl || req.url}`;
    const cachedData = await getCache(key);

    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    // Intercept res.json to cache the response
    const originalJson = res.json;
    res.json = function(body) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        setCache(key, body, ttl);
      }
      originalJson.call(this, body);
    };

    next();
  };
};

module.exports = {
  getCache,
  setCache,
  delCache,
  cacheMiddleware,
  redisClient
};
