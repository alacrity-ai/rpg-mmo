const { redisClient } = require('../../redisClient');
const taskRegistry = require('../../handlers/taskRegistry');
const logger = require('../../utilities/logger');
const config = require('../../config/config'); // Import the config

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
    logger.info(`Successfully completed getServerSettings task: ${taskId}`);
    await redisClient.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
  } catch (error) {
    const result = { error: 'Failed to get server settings. ' + error.message };
    logger.error(`Failed to get server settings in task: ${taskId}:`, error.message);
    await redisClient.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
  }
}

// Register task handler
taskRegistry.register('getServerSettings', processGetServerSettingsTask);

module.exports = {
  processGetServerSettingsTask,
};
