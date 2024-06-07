const { getRedisClient } = require('../redisClient');
const logger = require('../utilities/logger');

const redisClient = getRedisClient();

async function clearRedis() {
  try {
    await redisClient.flushall();
    logger.info('Redis database cleared successfully.');
  } catch (error) {
    logger.error('Failed to clear Redis database:', error.message);
  }
}

module.exports = clearRedis;
