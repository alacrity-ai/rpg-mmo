const { enqueueTask } = require('../db/cache/utility/taskUtils');
const { setCacheBattleInstanceCleared, getAllCachedBattleInstances, getAllCachedBattlerInstancesInBattle } = require('../db/cache/helpers/battleHelper');
const logger = require('../utilities/logger');

class BattleControllerService {
  constructor(redisClient) {
    this.redisClient = redisClient;
  }

  async runBattleControllerService() {
    try {
      const battleInstances = await getAllCachedBattleInstances(this.redisClient);
      for (const battleInstance of battleInstances) {
        // If cleared, skip it
        if (battleInstance.cleared) {
          continue;
        }

        // Process NPC scripts in battle
        const battlerInstances = await getAllCachedBattlerInstancesInBattle(this.redisClient, battleInstance.id);
        
        // Filter battlers by team
        const enemyBattlers = battlerInstances.filter(battler => battler.team === 'enemy');
        const playerBattlers = battlerInstances.filter(battler => battler.team === 'player');

        // Check if all battlers are dead on each team
        const allEnemiesDead = enemyBattlers.every(battler => !battler.alive);
        const allPlayersDead = playerBattlers.every(battler => !battler.alive);

        console.log('All enemies dead:', allEnemiesDead);
        if (allEnemiesDead && allPlayersDead || allEnemiesDead) {
            setCacheBattleInstanceCleared(this.redisClient, battleInstance.id);
            enqueueTask(this.redisClient, 'playerVictory', { battleInstanceId: battleInstance.id }, () => {
                logger.debug('Player victory task enqueued');
            });
        } else if (allPlayersDead) {
            setCacheBattleInstanceCleared(this.redisClient, battleInstance.id);
            console.log('Enemies win');
        }

        // Perform the NPC Scripts for all battlers
        for (const battlerInstance of battlerInstances) {
          if (battlerInstance.npcTemplateId && battlerInstance.scriptPath && battlerInstance.alive) {
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
