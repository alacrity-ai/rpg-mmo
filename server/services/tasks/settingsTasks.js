// workers/processGetServerSettingsTask.js
const { getRedisClient, addTaskResult } = require('../../redisClient');
const taskRegistry = require('../../handlers/taskRegistry');
const logger = require('../../utilities/logger');
const config = require('../../config/config');

const redisClient = getRedisClient();

async function processGetServerSettingsTask(task) {
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
