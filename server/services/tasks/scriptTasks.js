const { getRedisClient, addTaskResult } = require('../../redisClient');
const taskRegistry = require('../../handlers/taskRegistry');
const logger = require('../../utilities/logger');
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

    if (actionResult.success) {
      // Set the next action time in Redis
      const nextActionTimeKey = `nextActionTime:${battleInstanceId}:${battlerId}`;
      const nextActionTime = Date.now() + battlerInstance.scriptSpeed;
      await redisClient.set(nextActionTimeKey, nextActionTime, 'PX', battlerInstance.scriptSpeed);

      // Publish the results to the task-result-stream with the battleInstanceId so the server will know to transmit to all clients in the battle
      const result = { success: true, data: { battleInstanceId, actionResult } };
      await addTaskResult(redisClient, taskId, result);
    } else {
      throw new Error(actionResult.message);
    }
  } catch (error) {
    const result = { success: false, error: 'Failed to process runScriptAction task. ' + error.message };
    await addTaskResult(redisClient, taskId, result);
  }
}

// Register task handlers
taskRegistry.register('runScriptAction', processRunScriptActionTask);

module.exports = {
  processRunScriptActionTask,
};
