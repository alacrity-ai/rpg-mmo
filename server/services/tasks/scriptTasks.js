const { getRedisClient } = require('../../redisClient');
const taskRegistry = require('../../handlers/taskRegistry');
const logger = require('../../utilities/logger');
const { getAllCachedBattlerInstancesInBattle } = require('../../db/cache/battle')
const { getBattlerInstancesInBattle } = require('../../db/queries/battleInstancesQueries');
const { enqueueTask } = require('../../handlers/taskUtils');
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
      await redisClient.xadd('task-result-stream', '*', 'taskId', taskId, 'result', JSON.stringify(result));
    } else {
      throw new Error(actionResult.message);
    }
  } catch (error) {
    const result = { success: false, error: 'Failed to process runScriptAction task. ' + error.message };
    await redisClient.xadd('task-result-stream', '*', 'taskId', taskId, 'result', JSON.stringify(result));
  }
}

// workers/processScriptTasks.js
async function processRunNpcScriptsInBattleTask(task) {
  const { taskId, data } = task.taskData;
  const { battleInstanceId } = data;
  try {
    const battlerInstances = await getAllCachedBattlerInstancesInBattle(battleInstanceId);

    for (const battlerInstance of battlerInstances) {
      if (battlerInstance.npcTemplateId && battlerInstance.scriptPath) {
        const nextActionTimeKey = `nextActionTime:${battleInstanceId}:${battlerInstance.id}`;
        const nextActionTime = await redisClient.get(nextActionTimeKey);
        const currentTime = Date.now();
        
        // Ensure at least 5 seconds have passed since the timeCreated
        const timeCreated = new Date(battlerInstance.timeCreated).getTime();
        const timeSinceCreation = currentTime - timeCreated;
        if (timeSinceCreation < 5000) {
          continue;
        }

        if (!nextActionTime || currentTime >= nextActionTime) {
          // Enqueue the next script action task
          const nextTaskData = { battleInstanceId, battlerId: battlerInstance.id };
          await enqueueTask('runScriptAction', nextTaskData, () => {});
        }
      }
    }

    const result = { success: true };
    await redisClient.xadd('task-result-stream', '*', 'taskId', taskId, 'result', JSON.stringify(result));
  } catch (error) {
    const result = { success: false, error: 'Failed to run NPC scripts in battle. ' + error.message };
    logger.error(`Failed to run NPC scripts in battle for task ${taskId}: ${error.message}`);
    await redisClient.xadd('task-result-stream', '*', 'taskId', taskId, 'result', JSON.stringify(result));
  }
}


// Register task handlers
taskRegistry.register('runScriptAction', processRunScriptActionTask);
taskRegistry.register('runNpcScriptsInBattle', processRunNpcScriptsInBattleTask);

module.exports = {
  processRunScriptActionTask,
  processRunNpcScriptsInBattleTask
};
