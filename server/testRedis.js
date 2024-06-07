const Redis = require('ioredis');
const config = require('./config/config'); // Adjust the path if needed
const logger = require('./utilities/logger'); // Adjust the path if needed

const redisClient = new Redis({
  host: config.redis.host,
  port: config.redis.port
});

redisClient.on('connect', () => {
  logger.info('Redis client connected');
});

redisClient.on('ready', () => {
  logger.info('Redis client ready');
});

redisClient.on('error', (err) => {
  logger.error(`Redis client error: ${err.message}`);
});

redisClient.on('end', () => {
  logger.info('Redis client connection closed');
});

async function testRedis() {
  try {
    const streamName = 'testStream';
    const message = { testField: 'testValue' };

    // Create the stream if it does not exist
    await redisClient.xadd(streamName, '*', 'field', 'init');
    logger.info(`Stream ${streamName} initialized`);

    // Add a message to the stream
    const result = await redisClient.xadd(streamName, '*', 'field', JSON.stringify(message));
    logger.info(`Message added to stream ${streamName}, ID: ${result}`);
    
    // Read the message back
    const messages = await redisClient.xrange(streamName, '-', '+');
    logger.info(`Messages in stream: ${JSON.stringify(messages)}`);

    // Close the connection
    await redisClient.quit();
    logger.info('Redis client connection closed');
  } catch (error) {
    logger.error(`Error in testRedis: ${error.message}`);
    process.exit(1);
  }
}

// Run the test
testRedis();
