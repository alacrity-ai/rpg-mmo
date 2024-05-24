const Redis = require('ioredis');
const redis = new Redis();
const { addTask } = require('./taskQueue');
const logger = require('../../utilities/logger');

async function enqueueTask(taskType, taskData, callback) {
  try {
    const taskId = crypto.randomUUID(); // Generate a unique task ID
    const fullTaskData = { taskId, data: taskData };

    // Subscribe to a Redis channel for the task result
    const taskChannel = `task-result:${taskId}`;
    const onTaskResult = (channel, message) => {
      logger.info(`Message received on channel ${channel}: ${message}`);
      const response = JSON.parse(message);
      if (response.taskId === taskId) {
        logger.info(`Task result received: ${JSON.stringify(response.result)}`);
        callback(response.result);
        redis.unsubscribe(taskChannel);
        redis.off('message', onTaskResult);
      }
    };

    redis.subscribe(taskChannel, (err, count) => {
      if (err) {
        logger.info(`Failed to subscribe: ${err}`);
        callback({ error: 'Subscription failed. ' + err.message });
      } else {
        logger.info(`Subscribed to ${taskChannel}. ${count} total subscriptions.`);
        redis.on('message', onTaskResult);

        // Enqueue the task
        addTask(taskType, fullTaskData).then(() => {
        // No log message needed here for now
        }).catch((err) => {
          logger.info(`Failed to add task to queue: ${err}`);
          callback({ error: 'Task enqueue failed. ' + err.message });
        });
      }
    });
  } catch (error) {
    callback({ error: 'Task processing failed. ' + error.message });
  }
}

module.exports = {
  enqueueTask
};
