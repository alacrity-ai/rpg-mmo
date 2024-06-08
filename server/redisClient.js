// redisClient.js
const Redis = require('ioredis');
const config = require('./config/config');

// Function that returns a new redis client
function getRedisClient() {
  const redisClient = new Redis({
    host: config.redis.host,
    port: config.redis.port
  });

  redisClient.on('connect', () => {
    console.log('Redis client connected');
  });

  redisClient.on('error', (err) => {
    console.error('Redis client error:', err);
  });

  return redisClient;
}

// Wrapper function for xadd
async function addTaskResult(redisClient, taskId, result) {
  if (!redisClient || !redisClient.status || redisClient.status !== 'ready') {
    console.error('Redis client is not connected');
    throw new Error('Redis client is not connected');
  }

  try {
    await redisClient.xadd('task-result-stream', '*', 'taskId', taskId, 'result', JSON.stringify(result));
    console.log('Task added to stream successfully');
  } catch (err) {
    console.error('Error adding task to stream:', err);
    throw err;
  }
}

module.exports = {
  getRedisClient,
  addTaskResult,
};
