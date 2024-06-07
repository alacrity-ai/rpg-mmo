const { enqueueTask } = require('../handlers/taskUtils');
const { getAllCachedBattleInstances, getAllCachedBattlerInstancesInBattle } = require('../db/cache/battle');
const logger = require('../utilities/logger');
const redisClient = require('../redisClient').getRedisClient();

class BattleControllerService {
  static async runBattleControllerService() {
    try {
      const battleInstances = await getAllCachedBattleInstances();
      for (const battleInstance of battleInstances) {
        
        // Process NPC scripts in battle
        const battlerInstances = await getAllCachedBattlerInstancesInBattle(battleInstance.id);
        for (const battlerInstance of battlerInstances) {
          if (battlerInstance.npcTemplateId && battlerInstance.scriptPath) {
            const nextActionTimeKey = `nextActionTime:${battleInstance.id}:${battlerInstance.id}`;
            const nextActionTime = await redisClient.get(nextActionTimeKey);
            const currentTime = Date.now();
            
            // Ensure at least 5 seconds have passed since the timeCreated
            const timeCreated = new Date(battlerInstance.timeCreated).getTime();
            const timeSinceCreation = currentTime - timeCreated;
            if (timeSinceCreation < 5000) {
              continue;
            }

            if (!nextActionTime || currentTime >= nextActionTime) {              
              // Enqueue the next script action task
              const nextTaskData = { battleInstanceId: battleInstance.id, battlerId: battlerInstance.id };
              await enqueueTask('runScriptAction', nextTaskData, () => {
                logger.info(`Next script action enqueued for battler ${battlerInstance.id}`);
              });
            }
          }
        }
      }
    } catch (error) {
      logger.error('Error in battleControllerService:', error);
    }
  }

  static init() {
    setInterval(BattleControllerService.runBattleControllerService, 1000);
    logger.info('BattleControllerService started');
  }
}

module.exports = BattleControllerService;
