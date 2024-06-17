// workers/processExpeditionTasks.js
const { addTaskResult } = require('../../db/cache/client/RedisClient');
const taskRegistry = require('./registry/taskRegistry');
const { createExpeditionZone } = require('../../services/expeditions/zoneCreator');
const { getCharacterById, updateCharacterCurrentAreaId, updateCharacterAreas, getCharacterFlags } = require('../../db/queries/characterQueries');
const { getZoneTemplateBySceneKey } = require('../../db/queries/zoneTemplatesQueries');
const { setCacheAreaInstanceForParty, getCacheAreaInstanceForParty } = require('../../db/cache/helpers/partyHelper');
const { mapMarkers } = require('../../db/data/worldmap_locations/worldMapLocations')
const { getAreaInstanceById, updateAreaInstance } = require('../../db/queries/areaInstancesQueries');
const logger = require('../../utilities/logger');


async function processRequestRetreatTask(task, redisClient) {
  const { taskId, data } = task.taskData;
  const { zoneId, userId, characterId, partyId } = data;

  try {
    // Fetch the character's previous area ID
    const character = await getCharacterById(characterId);
    if (!character) {
      throw new Error(`Character with ID ${characterId} not found.`);
    }

    const previousAreaId = character.previousAreaId;
    if (!previousAreaId) {
      throw new Error(`Character with ID ${characterId} does not have a previous area ID.`);
    }

    const currentAreaId = character.currentAreaId;
    if (!currentAreaId) {
      throw new Error(`Character with ID ${characterId} does not have a current area ID.`);
    }

    // Update the character's current area ID to the previous area ID
    updateCharacterAreas(characterId, previousAreaId, currentAreaId)

    // Get the area instance data for the previous area
    const areaInstance = await getAreaInstanceById(previousAreaId);

    const result = { success: true, data: { previousAreaId, zoneId, areaInstance } };
    await addTaskResult(redisClient, taskId, result);
  } catch (error) {
    const result = { success: false, error: 'Failed to request retreat. ' + error.message };
    logger.error(`Retreat request failed for task ${taskId}: ${error.message}`);
    await addTaskResult(redisClient, taskId, result);
  }
}

async function processRequestWorldmapTask(task, redisClient) {
  const { taskId, data } = task.taskData;
  const { userId, characterId } = data;

  try {
    // Fetch the character's flags
    const characterFlags = await getCharacterFlags(characterId);

    // Filter the mapMarkersMap to only include the markers that the character has unlocked
    const filteredMapMarkersMap = mapMarkers.filter(marker => {
      const unlockFlag = `${marker.sceneKey}Unlocked`;
      return characterFlags[unlockFlag] === 1;
    });

    const result = { success: true, data: { filteredMapMarkersMap } };
    await addTaskResult(redisClient, taskId, result);
  } catch (error) {
    const result = { success: false, error: 'Failed to request worldmap. ' + error.message };
    logger.error(`Worldmap request failed for task ${taskId}: ${error.message}`);
    await addTaskResult(redisClient, taskId, result);
  }
}

async function processRequestTownAccess(task, redisClient) {
  const { taskId, data } = task.taskData;
  const { userId, characterId, sceneKey } = data;

  try {
    // Fetch the character's flags
    const characterFlags = await getCharacterFlags(characterId);

    // Check the town access flag
    if (!characterFlags[`${sceneKey}Unlocked`]) {
      throw new Error(`Character ${characterId} does not have access to town ${sceneKey}.`);
    }

    const result = { success: true, data: { sceneKey } };
    await addTaskResult(redisClient, taskId, result);
  } catch (error) {
    const result = { success: false, error: 'Failed to request town access. ' + error.message };
    logger.error(`Town access request failed for task ${taskId}: ${error.message}`);
    await addTaskResult(redisClient, taskId, result);
  }
}

async function processRequestZoneTask(task, redisClient) {
  const { taskId, data } = task.taskData;
  const { userId, characterId, partyId, sceneKey } = data;

  try {
    // Check if there is an existing area instance for the party and sceneKey
    const cachedAreaInstance = await getCacheAreaInstanceForParty(redisClient, partyId, sceneKey);

    if (cachedAreaInstance) {
      // Return the cached area instance
      const result = { success: true, data: { areaInstance: cachedAreaInstance } };
      await addTaskResult(redisClient, taskId, result);
      return;
    }

    // Fetch the zone template by scene key
    const zoneTemplate = await getZoneTemplateBySceneKey(sceneKey);
    if (!zoneTemplate) {
      throw new Error(`Zone template with scene key ${sceneKey} not found.`);
    }

    // Create the expedition zone
    console.log('Got zoneTemplate: ', zoneTemplate)
    const zoneInstance = await createExpeditionZone(zoneTemplate);

    if (!zoneInstance || !zoneInstance.areas || !Object.keys(zoneInstance.areas).length) {
      throw new Error('Failed to create zone instance or no areas defined.');
    }

    // Get the first area instance ID from the zone instance areas attribute
    const firstAreaId = Object.keys(zoneInstance.areas)[0];
    const areaInstance = await getAreaInstanceById(firstAreaId);
    areaInstance.areaConnections = zoneInstance.areas[firstAreaId];
    areaInstance.zoneInstanceId = zoneInstance.id;
    areaInstance.environmentEffects = zoneTemplate.environmentEffects;

    if (!areaInstance) {
      throw new Error(`Area instance with ID ${firstAreaId} not found.`);
    }
    // Update the player's current area ID
    updateCharacterCurrentAreaId(characterId, firstAreaId);

    // Cache the newly created area instance for the party and sceneKey
    await setCacheAreaInstanceForParty(redisClient, partyId, sceneKey, areaInstance);

    const result = { success: true, data: { areaInstance } };
    await addTaskResult(redisClient, taskId, result);
  } catch (error) {
    const result = { success: false, error: 'Failed to request zone. ' + error.message };
    logger.error(`Zone request failed for task ${taskId}: ${error.message}`);
    await addTaskResult(redisClient, taskId, result);
  }
}

async function processRequestAreaTask(task, redisClient) {
  const { taskId, data } = task.taskData;
  const { userId, characterId, partyId, currentAreaId, targetAreaId } = data;

  try {
    // Fetch the target area instance by ID
    const targetAreaInstance = await getAreaInstanceById(targetAreaId);
    if (!targetAreaInstance) {
      throw new Error(`Area instance with ID ${targetAreaId} not found.`);
    }

    // Fetch the current area instance by ID
    const currentAreaInstance = await getAreaInstanceById(currentAreaId);
    if (!currentAreaInstance) {
      throw new Error(`Area instance with ID ${currentAreaId} not found.`);
    }

    // Verify that if there is an encounter, it has been cleared
    if (currentAreaInstance.encounter !== null && !currentAreaInstance.encounterCleared) {
      throw new Error(`Encounter in current area instance with ID ${currentAreaId} has not been cleared.`);
    }

    // Verify that the target area instance is connected to the current area instance
    const connections = currentAreaInstance.areaConnections;
    const isConnected = Object.values(connections).includes(targetAreaId);
    if (!isConnected) {
      throw new Error(`Area instance with ID ${targetAreaId} is not connected to the current area instance with ID ${currentAreaId}.`);
    }

    // Mark the current area as explored
    currentAreaInstance.explored = true;

    try {
      await updateAreaInstance(currentAreaId, currentAreaInstance);
    } catch (error) {
      throw new Error(`Failed to update current area instance with ID ${currentAreaId}. ${error.message}`);
    }

    // Update character with current and previous area ids
    updateCharacterAreas(characterId, targetAreaId, currentAreaId);

    const result = { success: true, data: { areaInstance: targetAreaInstance } };
    await addTaskResult(redisClient, taskId, result);
  } catch (error) {
    const result = { success: false, error: 'Failed to request area. ' + error.message };
    logger.error(`Area request failed for task ${taskId}: ${error.message}`);
    await addTaskResult(redisClient, taskId, result);
  }
}

// Register task handlers
taskRegistry.register('requestZone', processRequestZoneTask);
taskRegistry.register('requestArea', processRequestAreaTask);
taskRegistry.register('requestTownAccess', processRequestTownAccess);
taskRegistry.register('requestWorldmap', processRequestWorldmapTask);
taskRegistry.register('requestRetreat', processRequestRetreatTask);

module.exports = {
  processRequestZoneTask,
  processRequestAreaTask,
  processRequestTownAccess,
  processRequestWorldmapTask,
  processRequestRetreatTask
};
