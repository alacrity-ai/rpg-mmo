// Initializer.js
const { initTables } = require('../db/database');
const { populateTables } = require('../db/populateTables');
const clearRedis = require('../handlers/taskClear');
const { createStreamIfNotExists, createConsumerGroup } = require('../handlers/taskQueue');
const BattleControllerService = require('./battleControllerService');
const { subscribeToTaskResultStream } = require('../handlers/taskResultSubscriber');
const logger = require('../utilities/logger');

class Initializer {
  static async initDatabase(redisClient) {
    await clearRedis(redisClient);
    await initTables();
    await populateTables();
    await createStreamIfNotExists(redisClient);
    await createConsumerGroup(redisClient);
    logger.info('Database initialization completed');
  }

  static startServices(io, redisClient, redisPub) {
    const battleControllerService = new BattleControllerService(redisPub);
    battleControllerService.start();
    subscribeToTaskResultStream(io, redisClient);
    logger.info('Services started');
  }
}

module.exports = Initializer;
