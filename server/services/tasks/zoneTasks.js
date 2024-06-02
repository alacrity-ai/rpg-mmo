const Redis = require('ioredis');
const { createExpeditionZone } = require('../../services/expeditions/zoneCreator');
const { getZoneTemplateBySceneKey } = require('../../db/queries/zoneTemplatesQueries');
const { getAreaInstanceById, updateAreaInstance } = require('../../db/queries/areaInstancesQueries');
const taskRegistry = require('../server/taskRegistry');
const logger = require('../../utilities/logger');
const redis = new Redis();

async function processRequestZoneTask(task) {
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

    const result = { success: true, data: { areaInstance } };
    logger.info(`Zone request successful for task ${taskId}`);
    await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
  } catch (error) {
    const result = { error: 'Failed to request zone. ' + error.message };
    logger.error(`Zone request failed for task ${taskId}:`, error.message);
    await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
  }
}

async function processRequestAreaTask(task) {
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
      console.log('Got the current Area Instance');
  
      // Verify that if there is an encounter, it has been cleared
      if (currentAreaInstance.encounter !== null && !currentAreaInstance.encounter_cleared) {
        throw new Error(`Encounter in current area instance with ID ${currentAreaId} has not been cleared.`);
      }
      console.log('Checked for encounters cleared');
  
      // Verify that the target area instance is connected to the current area instance
      const connections = currentAreaInstance.areaConnections;
      const isConnected = Object.values(connections).includes(targetAreaId);
      if (!isConnected) {
        throw new Error(`Area instance with ID ${targetAreaId} is not connected to the current area instance with ID ${currentAreaId}.`);
      }
      console.log('Checked for connections');
  
      // Mark the current area as explored
      currentAreaInstance.explored = true;
      console.log('Attempting to update the current area instance');
      try {
        await updateAreaInstance(currentAreaId, currentAreaInstance);
      } catch (error) {
        throw new Error(`Failed to update current area instance with ID ${currentAreaId}. ${error.message}`);
      }
      console.log('Finished updating the current area instance');
  
      const result = { success: true, data: { areaInstance: targetAreaInstance } };
      logger.info(`Area request successful for task ${taskId}`);
      await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
    } catch (error) {
      const result = { error: 'Failed to request area. ' + error.message };
      logger.error(`Area request failed for task ${taskId}:`, error.message);
      await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
    }
  }
  
  
// Register task handlers
taskRegistry.register('requestZone', processRequestZoneTask);
taskRegistry.register('requestArea', processRequestAreaTask);

module.exports = {
  processRequestZoneTask,
  processRequestAreaTask,
};