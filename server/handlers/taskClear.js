const Redis = require('ioredis');
const logger = require('../utilities/logger');
const redis = new Redis();

async function clearRedis() {
  try {
    await redis.flushall();
    logger.info('Redis database cleared successfully.');
  } catch (error) {
    logger.error('Failed to clear Redis database:', error.message);
  }
}

module.exports = clearRedis;
