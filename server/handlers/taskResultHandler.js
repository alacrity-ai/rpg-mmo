// services/server/taskResultHandler.js

const { redisSubscriber } = require('../redisClient');
const logger = require('../utilities/logger');

function handleTaskResult(taskChannel, callback, io) {
  const onTaskResult = (channel, message) => {
    try {
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
        redisSubscriber.unsubscribe(taskChannel);
        redisSubscriber.off('message', onTaskResult);
      }
    } catch (error) {
      logger.error(`Failed to process task result: ${error.message}`);
      callback({ success: false, error: 'Failed to process task result. ' + error.message });

      // Ensure to unsubscribe and remove the listener to avoid memory leaks
      redisSubscriber.unsubscribe(taskChannel);
      redisSubscriber.off('message', onTaskResult);
    }
  };

  redisSubscriber.subscribe(taskChannel, (err, count) => {
    if (err) {
      logger.error(`Failed to subscribe: ${err.message}`);
      callback({ success: false, error: 'Subscription failed. ' + err.message });
    } else {
      logger.info(`Subscribed to ${taskChannel}. ${count} total subscriptions.`);
      redisSubscriber.on('message', onTaskResult);
    }
  });
}

function handleNpcTaskResult(io) {
  const onNpcTaskResult = (channel, message) => {
    try {
      logger.info(`Message received on channel ${channel}: ${message}`); // Log received message
      if (channel !== 'npc-task-result') return; // Ensure we're only processing the NPC task result channel
      const response = JSON.parse(message);

      if (response.result.success) {
        const { battleInstanceId, actionResult } = response.result.data;
        if (battleInstanceId) {
          logger.info(`Emitting completedBattlerAction to battle-${battleInstanceId}`); // Log emission
          io.to(`battle-${battleInstanceId}`).emit('completedBattlerAction', actionResult);
        }
      } else {
        logger.error(`NPC task failed: ${response.result.error}`);
      }
    } catch (error) {
      logger.error(`Failed to process NPC task result: ${error.message}`);
    }
  };

  redisSubscriber.subscribe('npc-task-result', (err, count) => {
    if (err) {
      logger.error(`Failed to subscribe: ${err.message}`);
    } else {
      logger.info(`Subscribed to npc-task-result channel. ${count} total subscriptions.`);
      redisSubscriber.on('message', onNpcTaskResult);
    }
  });
}

module.exports = {
  handleTaskResult,
  handleNpcTaskResult
};
