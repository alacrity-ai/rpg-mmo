// workers/processGetServerSettingsTask.js
const { addTaskResult } = require('../../db/cache/client/RedisClient');
const taskRegistry = require('./registry/taskRegistry');
const logger = require('../../utilities/logger');
const config = require('../../config/config');


async function processGetServerSettingsTask(task, redisClient) {
  const { taskId, data } = task.taskData;
  try {
    // Organize the items into a structure that is usable by the client
    const serverSettings = {
      cooldowns: {
        minimum: config.cooldowns.minimum,
        shorter: config.cooldowns.shorter,
        short: config.cooldowns.short,
        normal: config.cooldowns.normal,
        long: config.cooldowns.long,
        longest: config.cooldowns.longest,
      },
    };

    const result = { success: true, data: serverSettings };
    await addTaskResult(redisClient, taskId, result);
  } catch (error) {
    const result = { success: false, error: 'Failed to get server settings. ' + error.message };
    await addTaskResult(redisClient, taskId, result);
  }
}

// Register task handler
taskRegistry.register('getServerSettings', processGetServerSettingsTask);

module.exports = {
  processGetServerSettingsTask,
};
