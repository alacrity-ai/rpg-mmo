// workers/processBattlerActionTasks.js
const { getRedisClient } = require('../../redisClient');
const taskRegistry = require('../../handlers/taskRegistry');
const logger = require('../../utilities/logger');
const BattleActionProcessor = require('./battleActionsUtils/BattleActionProcessor');

const redisClient = getRedisClient();

async function processAddBattlerActionTask(task) {
  const { taskId, data } = task.taskData;
  const { battleInstanceId, battlerId, actionType, actionData } = data;

  try {
    // Process the action immediately
    const actionResult = await BattleActionProcessor.processSingleAction({ battleInstanceId, battlerId, actionType, actionData });
    if (actionResult.success) {
      const result = { success: true, data: { battleInstanceId, actionResult } };
      logger.info(`Battler action processed successfully for task ${taskId}`);
      await redisClient.xadd('task-result-stream', '*', 'taskId', taskId, 'result', JSON.stringify(result));
    } else {
      throw new Error(actionResult.message);
    }
  } catch (error) {
    const result = { success: false, error: 'Failed to process battler action. ' + error.message };
    logger.error(`Processing battler action failed for task ${taskId}: ${error.message}`);
    await redisClient.xadd('task-result-stream', '*', 'taskId', taskId, 'result', JSON.stringify(result));
  }
}

// Register task handlers
taskRegistry.register('addBattlerAction', processAddBattlerActionTask);

module.exports = {
  processAddBattlerActionTask
};
