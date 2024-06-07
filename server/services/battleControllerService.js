// services/battleControllerService.js
const { enqueueTask } = require('../handlers/taskUtils');
const { getAllBattleInstances } = require('../db/queries/battleInstancesQueries');
const logger = require('../utilities/logger');

class BattleControllerService {
  static async runBattleControllerService() {
    try {
      const battleInstances = await getAllBattleInstances();
      for (const battleInstance of battleInstances) {
        console.log('BATTLECONTROLLERSERVICE: RUNNING BATTLE INSTANCE', battleInstance.id)
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
