// Initializer.js
const { initTables } = require('../db/database');
const { populateTables } = require('../db/populateTables');
const clearRedis = require('../handlers/taskClear');
const { createStreamIfNotExists, createConsumerGroup } = require('../handlers/taskQueue');
const BattleControllerService = require('./battleControllerService');
const { subscribeToTaskResultStream } = require('../handlers/taskResultSubscriber');
const logger = require('../utilities/logger');

class Initializer {
  static async initDatabase() {
    await clearRedis();
    await initTables();
    await populateTables();
    await createStreamIfNotExists();
    await createConsumerGroup();
    logger.info('Database initialization completed');
  }

  static startServices(io) {
    BattleControllerService.init();
    subscribeToTaskResultStream(io);
    logger.info('Services started');
  }
}

module.exports = Initializer;
