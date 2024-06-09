// workers/processExpeditionTasks.js
const { addTaskResult } = require('../../db/cache/client/RedisClient');
const taskRegistry = require('./registry/taskRegistry');
const { createExpeditionZone } = require('../../services/expeditions/zoneCreator');
const { updateCharacterCurrentAreaId, updateCharacterAreas, getCharacterFlags } = require('../../db/queries/characterQueries');
const { getZoneTemplateBySceneKey } = require('../../db/queries/zoneTemplatesQueries');
const { mapMarkers } = require('../../db/data/worldmap_locations/worldMapLocations')
const { getAreaInstanceById, updateAreaInstance } = require('../../db/queries/areaInstancesQueries');
const logger = require('../../utilities/logger');


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
    // Fetch the zone template by scene key
    const zoneTemplate = await getZoneTemplateBySceneKey(sceneKey);
    if (!zoneTemplate) {
      throw new Error(`Zone template with scene key ${sceneKey} not found.`);
    }

    // TODO : Uncomment this after handling initial flags / gaining new flags
    // const characterFlags = await getCharacterFlags(characterId);
    // if (!characterFlags[`${sceneKey}Unlocked`]) {
    //   throw new Error(`Character ${characterId} does not have access to zone ${sceneKey}.`);
    // }

    // Create the expedition zone
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
    if (currentAreaInstance.encounter !== null && !currentAreaInstance.encounter_cleared) {
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

module.exports = {
  processRequestZoneTask,
  processRequestAreaTask,
  processRequestTownAccess,
  processRequestWorldmapTask
};
