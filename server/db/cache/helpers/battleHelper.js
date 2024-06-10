// db/cache/helpers/battleHelper.js

// Function to cache a battle instance
async function setCacheBattleInstance(redisClient, battleInstance) {
  const battleInstanceKey = `battleInstance:${battleInstance.id}`;
  const battleInstanceAreaKey = `battleInstanceAreaInstance:${battleInstance.areaInstanceId}`;
  
  await redisClient.set(battleInstanceKey, JSON.stringify(battleInstance));
  await redisClient.set(battleInstanceAreaKey, battleInstance.id);
}

// Function to cache a battler instance
async function setCacheBattlerInstance(redisClient, battlerInstance, battleInstanceId) {
  const battlerInstanceKey = `battlerInstance:${battleInstanceId}:${battlerInstance.id}`;
  await redisClient.set(battlerInstanceKey, JSON.stringify(battlerInstance));
}

// Function to get a cached battle instance
async function getCacheBattleInstance(redisClient, battleInstanceId) {
  const battleInstanceKey = `battleInstance:${battleInstanceId}`;
  const battleInstance = await redisClient.get(battleInstanceKey);
  return battleInstance ? JSON.parse(battleInstance) : null;
}

// Function to get battle instance ID by areaInstanceId
async function getBattleInstanceIdByAreaId(redisClient, areaInstanceId) {
  const battleInstanceAreaKey = `battleInstanceAreaInstance:${areaInstanceId}`;
  return await redisClient.get(battleInstanceAreaKey);
}

// Function to get all cached battle instances
async function getAllCachedBattleInstances(redisClient) {
  const keys = await redisClient.keys('battleInstance:*');
  const battleInstances = await Promise.all(keys.map(async (key) => {
    const instance = await redisClient.get(key);
    return JSON.parse(instance);
  }));
  return battleInstances;
}

// Function to get a cached battler instance
async function getCacheBattlerInstance(redisClient, battleInstanceId, battlerInstanceId) {
  const battlerInstanceKey = `battlerInstance:${battleInstanceId}:${battlerInstanceId}`;
  const battlerInstance = await redisClient.get(battlerInstanceKey);
  return battlerInstance ? JSON.parse(battlerInstance) : null;
}

// Function to delete a cached battle instance along with all its battler instances
async function deleteCacheBattleInstance(redisClient, battleInstanceId) {
  const battleInstanceKey = `battleInstance:${battleInstanceId}`;
  const battleInstance = await getCacheBattleInstance(redisClient, battleInstanceId);
  
  if (battleInstance) {
    const battleInstanceAreaKey = `battleInstanceAreaInstance:${battleInstance.areaInstanceId}`;
    
    // Delete the battle instance
    await redisClient.del(battleInstanceKey);
    await redisClient.del(battleInstanceAreaKey);
  
    // Get all battler instance keys for the given battle instance
    const battlerInstanceKeys = await redisClient.keys(`battlerInstance:${battleInstanceId}:*`);
  
    // Delete all battler instance keys
    if (battlerInstanceKeys.length > 0) {
      await redisClient.del(battlerInstanceKeys);
    }
  }
}

// Function to delete a cached battler instance
async function deleteCacheBattlerInstance(redisClient, battleInstanceId, battlerInstanceId) {
  const battlerInstanceKey = `battlerInstance:${battleInstanceId}:${battlerInstanceId}`;
  await redisClient.del(battlerInstanceKey);
}

// Function to get all cached battler instances in a battle
async function getAllCachedBattlerInstancesInBattle(redisClient, battleInstanceId) {
  const keys = await redisClient.keys(`battlerInstance:${battleInstanceId}:*`);
  const battlerInstances = await Promise.all(keys.map(async (key) => {
    const instance = await redisClient.get(key);
    return JSON.parse(instance);
  }));
  return battlerInstances;
}

module.exports = {
  setCacheBattleInstance,
  setCacheBattlerInstance,
  getCacheBattleInstance,
  getBattleInstanceIdByAreaId,
  getCacheBattlerInstance,
  deleteCacheBattleInstance,
  deleteCacheBattlerInstance,
  getAllCachedBattleInstances,
  getAllCachedBattlerInstancesInBattle
};
