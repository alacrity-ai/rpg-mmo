// workers/processBattlerTasks.js
const { addTaskResult } = require('../../db/cache/client/RedisClient');
const taskRegistry = require('./registry/taskRegistry');
const { getBattlerInstanceById } = require('../../db/queries/battlerInstancesQueries');
const { getAbilityTemplatesByShortNames } = require('../../db/queries/abilityTemplatesQueries');
const logger = require('../../utilities/logger');


async function processGetBattlerAbilitiesTask(task, redisClient) {
  const { taskId, data } = task.taskData;
  const { battlerId } = data;

  try {
    // Fetch the battler instance to get the abilities
    const battlerInstance = await getBattlerInstanceById(battlerId);
    if (!battlerInstance) {
      throw new Error(`Battler instance with ID ${battlerId} not found.`);
    }

    const abilityShortNames = battlerInstance.abilities;
    let abilityTemplates = [];

    if (abilityShortNames && abilityShortNames.length > 0) {
      // Fetch the ability templates by short names
      abilityTemplates = await getAbilityTemplatesByShortNames(abilityShortNames);
    }

    const result = { success: true, data: abilityTemplates };
    await addTaskResult(redisClient, taskId, result);
  } catch (error) {
    const result = { success: false, error: 'Failed to retrieve battler abilities. ' + error.message };
    logger.error(`Battler abilities retrieval failed for task ${taskId}: ${error.message}`);
    await addTaskResult(redisClient, taskId, result);
  }
}

// Register task handlers
taskRegistry.register('getBattlerAbilities', processGetBattlerAbilitiesTask);

module.exports = {
  processGetBattlerAbilitiesTask
};
