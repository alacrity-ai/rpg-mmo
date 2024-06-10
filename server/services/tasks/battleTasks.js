// workers/processBattleTasks.js
const { addTaskResult } = require('../../db/cache/client/RedisClient');
const taskRegistry = require('./registry/taskRegistry');
const BattleCreator = require('../../services/expeditions/battleCreator');
const BattleManager = require('../../services/expeditions/battleManager');
const { getAreaInstanceById } = require('../../db/queries/areaInstancesQueries');
const { getBattlerInstancesByCharacterId, deleteBattlerInstancesByIds } = require('../../db/queries/battlerInstancesQueries');
const { getAllCachedBattleInstances, getCacheBattleInstance, getAllCachedBattlerInstancesInBattle, setCacheBattleInstance, setCacheBattlerInstance, getBattleInstanceIdByAreaId, deleteAllBattlerInstancesByIds } = require('../../db/cache/helpers/battleHelper');
const { getBattlerInstancesInBattle } = require('../../db/queries/battleInstancesQueries');
const logger = require('../../utilities/logger');

async function processGetBattleInstanceTask(task, redisClient) {
  const { taskId, data } = task.taskData;
  const { areaId, characterId } = data;

  try {
    // Check if there's an existing battle instance for the areaId
    const battleInstanceId = await getBattleInstanceIdByAreaId(redisClient, areaId);
    if (battleInstanceId) {
      // Add the new character to the battle
      const battleManager = new BattleManager(redisClient);
      const newBattlerInstance = await battleManager.addCharacterToBattle(battleInstanceId, characterId);

      // Get the most recent state of the battler instance from the database
      const battlerInstances = await getBattlerInstancesInBattle(battleInstanceId);
      // Get state of current battle from the cache
      const cachedBattleInstance = await getCacheBattleInstance(redisClient, battleInstanceId);

      // Include information that a new battler has joined
      const result = { 
        success: true, 
        data: { 
          battleInstance: cachedBattleInstance, 
          battlerInstances: battlerInstances,
          newBattlerJoined: true,
          newBattlerInstance: newBattlerInstance
        } 
      };
      await addTaskResult(redisClient, taskId, result);
      return;
    }

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

    // Cache the new battle instance and battler instances
    await setCacheBattleInstance(redisClient, response.battleInstance);
    for (const battlerInstance of response.battlerInstances) {
      await setCacheBattlerInstance(redisClient, battlerInstance, response.battleInstance.id);
    }

    const result = { success: true, data: response };
    await addTaskResult(redisClient, taskId, result);
  } catch (error) {
    const result = { success: false, error: 'Failed to retrieve or create battle instance. ' + error.message };
    logger.error(`Battle instance retrieval or creation failed for task ${taskId}: ${error.message}`);
    await addTaskResult(redisClient, taskId, result);
  }
}


async function processCleanupBattleTask(task, redisClient) {
  // Extract values:
  const { taskId, data } = task.taskData;
  const { characterId, partyId } = data;

  try {
    // get all of the Character's battle instances
    const battlerInstances = await getBattlerInstancesByCharacterId(characterId);
    // Return if battlerInstances is empty array
    if (!battlerInstances || !battlerInstances.length) {
      const result = { success: true };
      await addTaskResult(redisClient, taskId, result);
      return;
    }

    // Get a list of all the battler instance ids
    const battlerInstanceIds = battlerInstances.map(battler => battler.id);

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

    // Delete all battler instances for the character that may be leftover in any other in-progress battles from the database
    await deleteBattlerInstancesByIds(battlerInstanceIds);
    // Delete all battler instances for the character from the cache
    await deleteAllBattlerInstancesByIds(redisClient, battlerInstanceIds);

    const result = { 
      success: true, 
      data: {
        battlerLeft: true,
        leftBattlerIds: battlerInstanceIds,
        battleInstanceIds: characterBattleInstances.map(battleInstance => battleInstance.id),
        battleInstances: characterBattleInstances
      }
    };
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


