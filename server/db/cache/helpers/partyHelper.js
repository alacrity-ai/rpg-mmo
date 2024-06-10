const AreaInstance = require('../../../models/AreaInstance');

/**
 * Function to cache an area instance for a party
 * @param {Object} redisClient - The Redis client
 * @param {number} partyId - The ID of the party
 * @param {string} sceneKey - The key of the scene
 * @param {AreaInstance} areaInstance - The area instance to cache
 */
async function setCacheAreaInstanceForParty(redisClient, partyId, sceneKey, areaInstance) {
  const areaInstanceKey = `party:${partyId}:zone:${sceneKey}`;
  await redisClient.set(areaInstanceKey, JSON.stringify(areaInstance));
}

/**
 * Function to get a cached area instance for a party
 * @param {Object} redisClient - The Redis client
 * @param {number} partyId - The ID of the party
 * @param {string} sceneKey - The key of the scene
 * @returns {AreaInstance|null} - The cached area instance or null if not found
 */
async function getCacheAreaInstanceForParty(redisClient, partyId, sceneKey) {
  const areaInstanceKey = `party:${partyId}:zone:${sceneKey}`;
  const areaInstanceData = await redisClient.get(areaInstanceKey);
  
  if (!areaInstanceData) {
    return null;
  }
  
  const parsedData = JSON.parse(areaInstanceData);

  // Convert the parsed data to match the AreaInstance constructor parameters
  const areaInstance = new AreaInstance({
    id: parsedData.id,
    zone_name: parsedData.zoneName,
    zone_instance_id: parsedData.zoneInstanceId,
    zone_template_id: parsedData.zoneTemplateId,
    music_path: parsedData.musicPath,
    ambient_sound_path: parsedData.ambientSoundPath,
    background_image: parsedData.backgroundImage,
    area_connections: parsedData.areaConnections,
    encounter: parsedData.encounter,
    encounter_cleared: parsedData.encounterCleared,
    friendly_npcs: parsedData.friendlyNpcs,
    explored: parsedData.explored,
    event_instance_id: parsedData.eventInstanceId,
    environment_effects: parsedData.environmentEffects,
    created_at: parsedData.createdAt
  });

  return areaInstance;
}

/**
 * Function to delete a cached area instance for a party
 * @param {Object} redisClient - The Redis client
 * @param {number} partyId - The ID of the party
 * @param {string} sceneKey - The key of the scene
 */
async function deleteCacheAreaInstanceForParty(redisClient, partyId, sceneKey) {
  const areaInstanceKey = `party:${partyId}:zone:${sceneKey}`;
  await redisClient.del(areaInstanceKey);
}

/**
 * Function to get all cached area instances for a party
 * @param {Object} redisClient - The Redis client
 * @param {number} partyId - The ID of the party
 * @returns {AreaInstance[]} - An array of cached area instances
 */
async function getAllCachedAreaInstancesForParty(redisClient, partyId) {
  const keys = await redisClient.keys(`party:${partyId}:zone:*`);
  const areaInstances = await Promise.all(keys.map(async (key) => {
    const instanceData = await redisClient.get(key);
    const parsedData = JSON.parse(instanceData);

    // Convert the parsed data to match the AreaInstance constructor parameters
    return new AreaInstance({
      id: parsedData.id,
      zone_name: parsedData.zoneName,
      zone_instance_id: parsedData.zoneInstanceId,
      zone_template_id: parsedData.zoneTemplateId,
      music_path: parsedData.musicPath,
      ambient_sound_path: parsedData.ambientSoundPath,
      background_image: parsedData.backgroundImage,
      area_connections: parsedData.areaConnections,
      encounter: parsedData.encounter,
      encounter_cleared: parsedData.encounterCleared,
      friendly_npcs: parsedData.friendlyNpcs,
      explored: parsedData.explored,
      event_instance_id: parsedData.eventInstanceId,
      environment_effects: parsedData.environmentEffects,
      created_at: parsedData.createdAt
    });
  }));
  return areaInstances;
}

module.exports = {
  setCacheAreaInstanceForParty,
  getCacheAreaInstanceForParty,
  deleteCacheAreaInstanceForParty,
  getAllCachedAreaInstancesForParty
};
