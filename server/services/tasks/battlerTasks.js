// workers/processBattlerTasks.js
const { addTaskResult } = require('../../db/cache/client/RedisClient');
const taskRegistry = require('./registry/taskRegistry');
const { getBattlerInstanceById } = require('../../db/queries/battlerInstancesQueries');
const { getAbilityTemplatesByShortNames } = require('../../db/queries/abilityTemplatesQueries');
const { getBattlerInstancesInBattle } = require('../../db/queries/battleInstancesQueries');
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

async function processGetBattlersTask(task, redisClient) {
  const { taskId, data } = task.taskData;
  const { characterId, battleId } = data;

  try {
    // Fetch the battler instances in the battle
    const battlerInstances = await getBattlerInstancesInBattle(battleId);

    // Verify that at least one of the battler instances belongs to the character
    const battlerInstancesForCharacter = battlerInstances.filter(battler => battler.characterId === characterId);
    if (battlerInstancesForCharacter.length === 0) {
      throw new Error(`No battler instances found for character with ID ${characterId} in battle with ID ${battleId}.`);
    }

    const result = { success: true, data: battlerInstances };
    await addTaskResult(redisClient, taskId, result);
  } catch (error) {
    const result = { success: false, error: 'Failed to retrieve battlers. ' + error.message };
    logger.error(`Battlers retrieval failed for task ${taskId}: ${error.message}`);
    await addTaskResult(redisClient, taskId, result);
  }
}

// Register task handlers
taskRegistry.register('getBattlerAbilities', processGetBattlerAbilitiesTask);
taskRegistry.register('getBattlers', processGetBattlersTask);

module.exports = {
  processGetBattlerAbilitiesTask
};
