// workers/processBattleTasks.js
const { addTaskResult } = require('../../db/cache/client/RedisClient');
const taskRegistry = require('./registry/taskRegistry');
const BattleCreator = require('../../services/expeditions/battleCreator');
const BattleManager = require('../../services/expeditions/battleManager');
const { getAreaInstanceById } = require('../../db/queries/areaInstancesQueries');
const { getBattlerInstancesByCharacterId } = require('../../db/queries/battlerInstancesQueries');
const { getAllCachedBattleInstances, getAllCachedBattlerInstancesInBattle } = require('../../db/cache/helpers/battleHelper');
const logger = require('../../utilities/logger');


async function processGetBattleInstanceTask(task, redisClient) {
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
    await addTaskResult(redisClient, taskId, result);
  } catch (error) {
    const result = { success: false, error: 'Failed to retrieve or create battle instance. ' + error.message };
    logger.error(`Battle instance retrieval or creation failed for task ${taskId}: ${error.message}`);
    await addTaskResult(redisClient, taskId, result);
  }
}

// Cleanup battle task
async function processCleanupBattleTask(task, redisClient) {
  // Extract values:
  const { taskId, data } = task.taskData;
  const { characterId, partyId } = data;

  try {
    // get all of the Character's battle instances
    const battlerInstances = await getBattlerInstancesByCharacterId(characterId);
    // Return if battlerInstances is empty array
    if (!battlerInstances || !battlerInstances.length) {
      console.log('Got battler instances: ', battlerInstances)
      console.log('No battler instances found for characterId:', characterId)
      const result = { success: true };
      await addTaskResult(redisClient, taskId, result);
      return;
    }

    // Get all battle instances in the game
    const battleInstances = await getAllCachedBattleInstances(redisClient);

    // Filter out to only have the battles that the character is in
    const characterBattlerIds = battlerInstances.map(battler => battler.id);
    const characterBattleInstances = battleInstances.filter(battleInstance => {
        return battleInstance.battlerIds.some(battlerId => characterBattlerIds.includes(battlerId));
    });

    // Further filter to only include battles where the only BattlerInstance with a defined characterId is the character's
    const filteredBattleInstances = [];

    for (const battleInstance of characterBattleInstances) {
        // Get all battler instances for the current battle
        const battlerInstancesInBattle = await getAllCachedBattlerInstancesInBattle(redisClient, battleInstance.id);

        // Check if the character's battler instance is the only one with a defined characterId
        const hasOtherCharacters = battlerInstancesInBattle.some(battler => 
            battler.characterId && !characterBattlerIds.includes(battler.id)
        );

        if (!hasOtherCharacters) {
            filteredBattleInstances.push(battleInstance);
        }
    }

    // For each of the final filtered battle instances, cleanup that battle
    const battleManager = new BattleManager(redisClient);
    for (const battleInstance of filteredBattleInstances) {
      await battleManager.cleanupBattle(battleInstance.id);
    }
    const result = { success: true };
    await addTaskResult(redisClient, taskId, result);
  } catch (error) {
    const result = { success: false, error: 'Failed to cleanup battle. ' + error.message };
    logger.error(`Battle cleanup failed for task ${taskId}: ${error.message}`);
    await addTaskResult(redisClient, taskId, result);
  }
}

// Register task handlers
taskRegistry.register('getBattleInstance', processGetBattleInstanceTask);
taskRegistry.register('cleanupBattle', processCleanupBattleTask);

module.exports = {
  processGetBattleInstanceTask,
};


