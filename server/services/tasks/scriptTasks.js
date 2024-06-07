// workers/processScriptTasks.js
const { getRedisClient } = require('../../redisClient');
const taskRegistry = require('../../handlers/taskRegistry');
const logger = require('../../utilities/logger');
const { enqueueTask } = require('../../handlers/taskUtils');
const { getBattlerInstancesInBattle } = require('../../db/queries/battleInstancesQueries');
const NPCScriptExecutor = require('./battleActionsUtils/NpcScriptExecutor');

const redisClient = getRedisClient();

async function processRunScriptActionTask(task) {
  const { taskId, data } = task.taskData;
  const { battleInstanceId, battlerId } = data;

  try {
    const battlerInstances = await getBattlerInstancesInBattle(battleInstanceId);
    const battlerInstance = battlerInstances.find(bi => bi.id === battlerId);
    if (!battlerInstance) {
      throw new Error(`Battler instance with ID ${battlerId} not found in battle instance ${battleInstanceId}`);
    }

    const npcScriptExecutor = new NPCScriptExecutor(battlerInstance, battlerInstances, battleInstanceId);

    // Run the script and get the result
    const actionResult = await npcScriptExecutor.runScript();

    // Enqueue the next script action task based on the battler's script speed (delay), this way a battler will perform an action continuously
    const nextTaskData = { battleInstanceId, battlerId };
    const delay = battlerInstance.scriptSpeed;
    console.log('ENQUEING NEXT TASK WITH DELAY', delay, 'AT TIME', Date.now());
    await enqueueTask('runScriptAction', nextTaskData, () => {
      logger.info(`Next script action enqueued for battler ${battlerId}`);
    }, delay);

    if (actionResult.success) {
      // Publish the results to the task-result-stream with the battleInstanceId so the server will know to transmit to all clients in the battle
      const result = { success: true, data: { battleInstanceId, actionResult } };
      logger.info(`RunScriptAction task processed successfully for task ${taskId}`);
      await redisClient.xadd('task-result-stream', '*', 'taskId', taskId, 'result', JSON.stringify(result));
    } else {
      throw new Error(actionResult.message);
    }
  } catch (error) {
    const result = { success: false, error: 'Failed to process runScriptAction task. ' + error.message };
    logger.error(`Processing runScriptAction task failed for task ${taskId}: ${error.message}`);
    await redisClient.xadd('task-result-stream', '*', 'taskId', taskId, 'result', JSON.stringify(result));
  }
}

// Register task handlers
taskRegistry.register('runScriptAction', processRunScriptActionTask);

module.exports = {
  processRunScriptActionTask
};
