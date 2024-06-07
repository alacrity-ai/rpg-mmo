// workers/processBattleTasks.js
const { getRedisClient } = require('../../redisClient');
const BattleCreator = require('../../services/expeditions/battleCreator');
const { getAreaInstanceById } = require('../../db/queries/areaInstancesQueries');
const taskRegistry = require('../../handlers/taskRegistry');
const logger = require('../../utilities/logger');

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

// Register task handlers
taskRegistry.register('getBattleInstance', processGetBattleInstanceTask);

module.exports = {
  processGetBattleInstanceTask,
};
