// workers/processGetServerSettingsTask.js
const { getRedisClient } = require('../../redisClient');
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
    await redisClient.xadd('task-result-stream', '*', 'taskId', taskId, 'result', JSON.stringify(result));
  } catch (error) {
    const result = { success: false, error: 'Failed to get server settings. ' + error.message };
    await redisClient.xadd('task-result-stream', '*', 'taskId', taskId, 'result', JSON.stringify(result));
  }
}

// Register task handler
taskRegistry.register('getServerSettings', processGetServerSettingsTask);

module.exports = {
  processGetServerSettingsTask,
};
