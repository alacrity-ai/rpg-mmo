const logger = require('../utilities/logger');
const { callbackMap } = require('./taskUtils');

function processTaskResult(io, taskId, taskResult) {
  logger.info(`Processing result for task ID: ${taskId}`);
  
  // Retrieve the callback from the map
  const callback = callbackMap.get(taskId);
  
  // Call the callback with the result
  if (callback) {
    if (taskResult.success) {
      callback(taskResult);
    } else {
      logger.error(`Task failed: ${taskResult.error}`);
      callback({ success: false, error: taskResult.error });
    }
    // Remove the callback from the map
    callbackMap.delete(taskId);
  }

  // Emit to battle room if applicable
  // Only for processRunScriptActionTask (for NPCs actions), and processAddBattlerActionTask (for player actions)
  if (taskResult.data && taskResult.data.actionResult) {
    const battleInstanceId = taskResult.data.battleInstanceId;
    io.to(`battle-${battleInstanceId}`).emit('completedBattlerAction', taskResult.data.actionResult);
  }
}

module.exports = {
  processTaskResult
};
