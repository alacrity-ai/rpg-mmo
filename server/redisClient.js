// redisClient.js
const Redis = require('ioredis');
const config = require('./config/config');

// const redisClient = new Redis({
//   host: config.redis.host,
//   port: config.redis.port
// });

// const redisSubscriber = new Redis({
//   host: config.redis.host,
//   port: config.redis.port
// });

// function that returns a new redis client
function getRedisClient() {
  return new Redis({
    host: config.redis.host,
    port: config.redis.port
  });
}

module.exports = {
  getRedisClient,
};
