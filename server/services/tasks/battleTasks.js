// workers/processBattleTasks.js
const { getRedisClient } = require('../../redisClient');
const BattleCreator = require('../../services/expeditions/battleCreator');
const { getAreaInstanceById } = require('../../db/queries/areaInstancesQueries');
const taskRegistry = require('../../handlers/taskRegistry');
const logger = require('../../utilities/logger');
const { enqueueTask } = require('../../handlers/taskUtils');

const redisClient = getRedisClient();

async function processGetBattleInstanceTask(task) {
  const { taskId, data } = task.taskData;
  const { areaId, characterId } = data;

  try {
    // Fetch the area instance to get the encounter template ID
    const areaInstance = await getAreaInstanceById(areaId);
    if (!areaInstance) {
      throw new Error(`Area instance with ID ${areaId} not found.`);
    }
    const encounterTemplateId = areaInstance.encounter;
    // If no encounter is set, throw an error
    if (!encounterTemplateId) {
      throw new Error(`No encounter set for area instance with ID ${areaId}.`);
    }

    // Initialize the BattleCreator with the given parameters
    const battleCreator = new BattleCreator(characterId, encounterTemplateId, areaId);
    const response = await battleCreator.execute();

    const result = { success: true, data: response };
    logger.info(`Battle instance retrieval or creation successful for task ${taskId}`);
    await redisClient.xadd('task-result-stream', '*', 'taskId', taskId, 'result', JSON.stringify(result));
  } catch (error) {
    const result = { success: false, error: 'Failed to retrieve or create battle instance. ' + error.message };
    logger.error(`Battle instance retrieval or creation failed for task ${taskId}: ${error.message}`);
    await redisClient.xadd('task-result-stream', '*', 'taskId', taskId, 'result', JSON.stringify(result));
  }
}

async function processStartBattlerScriptsTask(task) {
  const { taskId, data } = task.taskData;
  const { battleInstance, battlerInstances } = data.data;

  try {
    logger.info(`Battler scripts started for battle instance ${battleInstance.id}`);
    logger.info(`Full objects available: ${battleInstance}, ${battlerInstances}`);

    // Identify NPC battlers and enqueue a runScriptAction task for each
    for (const battlerInstance of battlerInstances) {
      if (battlerInstance.npcTemplateId) {
        const nextTaskData = {
          battleInstanceId: battleInstance.id,
          battlerId: battlerInstance.id
        };
        const delay = battlerInstance.scriptSpeed;
        console.log('ENQUEING NEXT TASK WITH DELAY', delay, 'AT TIME', Date.now());
        await enqueueTask('runScriptAction', nextTaskData, () => {
          logger.info(`Initial script action enqueued for NPC battler ${battlerInstance.id}`);
        }, delay);
      }
    }

    // Publish the results for the startBattlerScripts task
    const result = { success: true, data: { battleInstanceId: battleInstance.id } };
    await redisClient.xadd('task-result-stream', '*', 'taskId', taskId, 'result', JSON.stringify(result));
  } catch (error) {
    const result = { success: false, error: 'Failed to start battler scripts. ' + error.message };
    logger.error(`Failed to start battler scripts for task ${taskId}: ${error.message}`);
    await redisClient.xadd('task-result-stream', '*', 'taskId', taskId, 'result', JSON.stringify(result));
  }
}

// Register task handlers
taskRegistry.register('getBattleInstance', processGetBattleInstanceTask);
taskRegistry.register('startBattlerScripts', processStartBattlerScriptsTask);

module.exports = {
  processGetBattleInstanceTask,
  processStartBattlerScriptsTask,
};
