// services/battleControllerService.js
const { enqueueTask } = require('../handlers/taskUtils');
const { getAllCachedBattleInstances } = require('../db/cache/battle');
const logger = require('../utilities/logger');

class BattleControllerService {
  static async runBattleControllerService() {
    try {
      const battleInstances = await getAllCachedBattleInstances();
      for (const battleInstance of battleInstances) {
        await enqueueTask('runNpcScriptsInBattle', { battleInstanceId: battleInstance.id });
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
