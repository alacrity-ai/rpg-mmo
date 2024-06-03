// services/server/taskResultHandler.js

const Redis = require('ioredis');
const redis = new Redis();
const logger = require('../utilities/logger');

function handleTaskResult(taskChannel, callback, io) {
  const onTaskResult = (channel, message) => {
    try {
      logger.info(`Message received on channel ${channel}: ${message}`);
      const response = JSON.parse(message);
      if (response.taskId === taskChannel.split(':')[1]) { // Extract taskId from the channel name
        logger.info(`Task result received: ${JSON.stringify(response.result)}`);
        if (response.result.success) {
          callback(response.result);
        } else {
          logger.error(`Task failed: ${response.result.error}`);
          callback(response.result); // Pass the error to the callback
        }

        // Emit to battle room if applicable
        const battleInstanceId = response.result.data && response.result.data.battleInstanceId || false;
        if (battleInstanceId && io) {
          io.to(`battle-${battleInstanceId}`).emit('completedBattlerAction', response.result.data.actionResult);
        }

        // Unsubscribe and remove the listener
        redis.unsubscribe(taskChannel);
        redis.off('message', onTaskResult);
      }
    } catch (error) {
      logger.error(`Failed to process task result: ${error.message}`);
      callback({ success: false, error: 'Failed to process task result. ' + error.message });

      // Ensure to unsubscribe and remove the listener to avoid memory leaks
      redis.unsubscribe(taskChannel);
      redis.off('message', onTaskResult);
    }
  };

  redis.subscribe(taskChannel, (err, count) => {
    if (err) {
      logger.error(`Failed to subscribe: ${err.message}`);
      callback({ success: false, error: 'Subscription failed. ' + err.message });
    } else {
      logger.info(`Subscribed to ${taskChannel}. ${count} total subscriptions.`);
      redis.on('message', onTaskResult);
    }
  });
}

module.exports = {
  handleTaskResult
};
