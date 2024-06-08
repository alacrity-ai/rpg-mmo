// redisClient.js
const Redis = require('ioredis');
const config = require('./config/config');
const logger = require('./utilities/logger');

// Function that returns a new redis client
function getRedisClient() {
  const redisClient = new Redis({
    host: config.redis.host,
    port: config.redis.port
  });

  redisClient.on('connect', () => {
    logger.info('Redis client connected');
  });

  redisClient.on('error', (err) => {
    logger.error(`Redis client error: ${err.message}`);
  });

  return redisClient;
}

// Wrapper function for xadd
async function addTaskResult(redisClient, taskId, result) {
  if (!redisClient || !redisClient.status || redisClient.status !== 'ready') {
    logger.error(`Redis client is not connected`);
    throw new Error(`Redis client is not connected`);
  }

  try {
    await redisClient.xadd('task-result-stream', '*', 'taskId', taskId, 'result', JSON.stringify(result));
    logger.info(`Result added to stream for task ID: ${taskId}`);
  } catch (err) {
    console.error(`Error adding result to stream for task ID: ${taskId}, error: ${err.message}`);
    throw err;
  }
}

module.exports = {
  getRedisClient,
  addTaskResult,
};
