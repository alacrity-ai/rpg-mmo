const { getRedisClient } = require('../../redisClient');

const redisClient = getRedisClient();

// Function to cache a battle instance
async function setCacheBattleInstance(battleInstance) {
  const battleInstanceKey = `battleInstance:${battleInstance.id}`;
  await redisClient.set(battleInstanceKey, JSON.stringify(battleInstance));
}

// Function to cache a battler instance
async function setCacheBattlerInstance(battlerInstance, battleInstanceId) {
  const battlerInstanceKey = `battlerInstance:${battleInstanceId}:${battlerInstance.id}`;
  await redisClient.set(battlerInstanceKey, JSON.stringify(battlerInstance));
}

// Function to get a cached battle instance
async function getCacheBattleInstance(battleInstanceId) {
  const battleInstanceKey = `battleInstance:${battleInstanceId}`;
  const battleInstance = await redisClient.get(battleInstanceKey);
  return battleInstance ? JSON.parse(battleInstance) : null;
}

// Function to get a cached battler instance
async function getCacheBattlerInstance(battleInstanceId, battlerInstanceId) {
  const battlerInstanceKey = `battlerInstance:${battleInstanceId}:${battlerInstanceId}`;
  const battlerInstance = await redisClient.get(battlerInstanceKey);
  return battlerInstance ? JSON.parse(battlerInstance) : null;
}

// Function to delete a cached battle instance
async function deleteCacheBattleInstance(battleInstanceId) {
  const battleInstanceKey = `battleInstance:${battleInstanceId}`;
  await redisClient.del(battleInstanceKey);
}

// Function to delete a cached battler instance
async function deleteCacheBattlerInstance(battleInstanceId, battlerInstanceId) {
  const battlerInstanceKey = `battlerInstance:${battleInstanceId}:${battlerInstanceId}`;
  await redisClient.del(battlerInstanceKey);
}

// Function to get all cached battle instances
async function getAllCachedBattleInstances() {
  const keys = await redisClient.keys('battleInstance:*');
  const battleInstances = await Promise.all(keys.map(async (key) => {
    const instance = await redisClient.get(key);
    return JSON.parse(instance);
  }));
  return battleInstances;
}

async function getAllCachedBattlerInstancesInBattle(battleInstanceId) {
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
  getCacheBattlerInstance,
  deleteCacheBattleInstance,
  deleteCacheBattlerInstance,
  getAllCachedBattleInstances,
  getAllCachedBattlerInstancesInBattle
};
