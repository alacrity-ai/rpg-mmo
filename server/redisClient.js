// redisClient.js
const Redis = require('ioredis');
const config = require('./config/config');

// Function that returns a new redis client
function getRedisClient() {
  return new Redis({
    host: config.redis.host,
    port: config.redis.port
  });
}

// Wrapper function for xadd
async function addTaskResult(redisClient, taskId, result) {
  await redisClient.xadd('task-result-stream', '*', 'taskId', taskId, 'result', JSON.stringify(result));
}

module.exports = {
  getRedisClient,
  addTaskResult,
};
