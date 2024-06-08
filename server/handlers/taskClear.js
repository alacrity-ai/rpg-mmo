const logger = require('../utilities/logger');


async function clearRedis(redisClient) {
  try {
    await redisClient.flushall();
    logger.info('Redis database cleared successfully.');
  } catch (error) {
    logger.error('Failed to clear Redis database:', error.message);
  }
}

module.exports = clearRedis;
