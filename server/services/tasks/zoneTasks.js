const Redis = require('ioredis');
const { createExpeditionZone } = require('../../services/expeditions/zoneCreator');
const { getZoneTemplateBySceneKey } = require('../../db/queries/zoneTemplatesQueries');
const { getCharacterFlags } = require('../../db/queries/characterQueries');
const { getAreaInstanceById } = require('../../db/queries/areaInstancesQueries');
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

// Register task handlers
taskRegistry.register('requestZone', processRequestZoneTask);

module.exports = {
  processRequestZoneTask,
};
