// redisClient.js
const Redis = require('ioredis');
const config = require('./config/config');

const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port
});

module.exports = redis;
