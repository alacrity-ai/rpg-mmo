const Redis = require('ioredis');
const taskRegistry = require('../../handlers/taskRegistry');
const logger = require('../../utilities/logger');
const config = require('../../config/config'); // Import the config
const redis = new Redis();

async function processGetServerSettingsTask(task) {
  const { taskId, data } = task.taskData;
  try {
    // Organize the items into a structure that is usable by the client
    const serverSettings = {
      cooldowns: {
        minimum: config.cooldowns.minimum,
        short: config.cooldowns.short,
        normal: config.cooldowns.normal,
        long: config.cooldowns.long,
      },
    };

    const result = { success: true, data: serverSettings };
    logger.info(`Successfully completed getServerSettings task: ${taskId}`);
    await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
  } catch (error) {
    const result = { error: 'Failed to get server settings. ' + error.message };
    logger.error(`Failed to get server settings in task: ${taskId}:`, error.message);
    await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
  }
}

// Register task handler
taskRegistry.register('getServerSettings', processGetServerSettingsTask);

module.exports = {
  processGetServerSettingsTask,
};
