const { enqueueTask } = require('../db/cache/utility/taskUtils');
const { getAllCachedBattleInstances, getAllCachedBattlerInstancesInBattle } = require('../db/cache/battle');
const logger = require('../utilities/logger');

class BattleControllerService {
  constructor(redisClient) {
    this.redisClient = redisClient;
  }

  async runBattleControllerService() {
    try {
      const battleInstances = await getAllCachedBattleInstances(this.redisClient);
      for (const battleInstance of battleInstances) {
        
        // Process NPC scripts in battle
        const battlerInstances = await getAllCachedBattlerInstancesInBattle(this.redisClient, battleInstance.id);
        for (const battlerInstance of battlerInstances) {
          if (battlerInstance.npcTemplateId && battlerInstance.scriptPath) {
            const nextActionTimeKey = `nextActionTime:${battleInstance.id}:${battlerInstance.id}`;
            const nextActionTime = await this.redisClient.get(nextActionTimeKey);
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
              await enqueueTask(this.redisClient, 'runScriptAction', nextTaskData, () => {
                logger.debug(`Next script action enqueued for battler ${battlerInstance.id}`);
              });
            }
          }
        }
      }
    } catch (error) {
      logger.error('Error in battleControllerService:', error);
    }
  }

  start() {
    setInterval(() => this.runBattleControllerService(), 1000);
    logger.info('BattleControllerService started');
  }
}

module.exports = BattleControllerService;
