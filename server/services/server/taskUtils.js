const Redis = require('ioredis');
const redis = new Redis();
const { addTask } = require('./taskQueue');
const logger = require('../../utilities/logger');
const crypto = require('crypto');

async function enqueueTask(taskType, taskData, callback, io) {
  try {
    const taskId = crypto.randomUUID(); // Generate a unique task ID
    const fullTaskData = { taskId, data: taskData };

    // Subscribe to a Redis channel for the task result
    const taskChannel = `task-result:${taskId}`;
    const onTaskResult = (channel, message) => {
      try {
        logger.info(`Message received on channel ${channel}: ${message}`);
        const response = JSON.parse(message);
        if (response.taskId === taskId) {
          logger.info(`Task result received: ${JSON.stringify(response.result)}`);
          callback(response.result);
          if (response.result.error) {
            logger.error(`Task failed: ${response.result.error}`);
            throw new Error(response.result.error);
          }
          const battleInstanceId = response.result.data.battleInstanceId || false;
          if (battleInstanceId) {
            io.to(`battle-${battleInstanceId}`).emit('completedBattlerAction', response.result.data.actionResult);
          }

          redis.unsubscribe(taskChannel);
          redis.off('message', onTaskResult);
        }
      } catch (error) {
        callback({ error: 'Failed to process task result. ' + error.message });

        // Ensure to unsubscribe and remove the listener to avoid memory leaks
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

          // Ensure to unsubscribe and remove the listener to avoid memory leaks
          redis.unsubscribe(taskChannel);
          redis.off('message', onTaskResult);
        });
      }
    });
  } catch (error) {
    logger.error(`Error enqueuing task: ${error.message}`);
    callback({ error: 'Task processing failed. ' + error.message });
  }
}

module.exports = {
  enqueueTask
};
