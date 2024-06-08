// handlers/taskResultSubscriber.js
const logger = require('../utilities/logger');
const { processTaskResult } = require('./taskResultHandler');

async function subscribeToTaskResultStream(io, redisClient) {
  const streamName = 'task-result-stream';
  let lastId = '0';  // Start from the beginning of the stream

  logger.info(`Subscribing to ${streamName}...`);

  while (true) {
    try {
      const result = await redisClient.xread('BLOCK', 0, 'STREAMS', streamName, lastId);
      const [stream, messages] = result[0];
      messages.forEach(message => {
        const [id, fields] = message;
        const taskId = fields[1]; // Assuming the taskId is stored in the second field
        const taskResult = JSON.parse(fields[3]); // Assuming the result is stored in the fourth field

        // Process the task result
        processTaskResult(io, taskId, taskResult);

        // Update lastId to the ID of the last processed message
        lastId = id;
      });
    } catch (error) {
      logger.error(`Error reading from stream: ${error.message}`);
    }
  }
}

module.exports = {
  subscribeToTaskResultStream
};
