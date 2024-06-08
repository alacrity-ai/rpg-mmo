// workers/processBattlerActionTasks.js
const { addTaskResult } = require('../../db/cache/client/RedisClient');
const taskRegistry = require('./registry/taskRegistry');
const logger = require('../../utilities/logger');
const BattleActionProcessor = require('./battleActionsUtils/BattleActionProcessor');

async function processAddBattlerActionTask(task, redisClient) {
  const { taskId, data } = task.taskData;
  const { battleInstanceId, battlerId, actionType, actionData } = data;

  try {
    // Process the action immediately
    const battleActionProcessor = new BattleActionProcessor(redisClient);
    const actionResult = await battleActionProcessor.processSingleAction({ battleInstanceId, battlerId, actionType, actionData });
    if (actionResult.success) {
      const result = { success: true, data: { battleInstanceId, actionResult } };
      await addTaskResult(redisClient, taskId, result);
    } else {
      throw new Error(actionResult.message);
    }
  } catch (error) {
    const result = { success: false, error: 'Failed to process battler action. ' + error.message };
    logger.error(`Processing battler action failed for task ${taskId}: ${error.message}`);
    await addTaskResult(redisClient, taskId, result);
  }
}

// Register task handlers
taskRegistry.register('addBattlerAction', processAddBattlerActionTask);

module.exports = {
  processAddBattlerActionTask
};
