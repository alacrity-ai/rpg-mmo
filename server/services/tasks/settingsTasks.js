const Redis = require('ioredis');
const taskRegistry = require('../server/taskRegistry');
const logger = require('../../utilities/logger');
const redis = new Redis();

async function processGetServerSettingsTask(task) {
  const { taskId, data } = task.taskData;
  try {
    // Organize the items into a structure that is usable by the client
    const serverSettings = {
      cooldowns: {
        minimum: parseInt(process.env.COOLDOWN_MINIMUM, 10) || 500,
        short: parseInt(process.env.COOLDOWN_SHORT, 10) || 1500,
        normal: parseInt(process.env.COOLDOWN_NORMAL, 10) || 3000,
        long: parseInt(process.env.COOLDOWN_LONG, 10) || 5000,
      },
    };

    const result = { success: true, data: serverSettings };
    logger.info(`Successfully completed getServerSettings task: ${taskId}`);
    await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
  } catch (error) {
    const result = { error: 'Failed to get server settings. ' + error.message };
    logger.info(`Failed to get server settings in task: ${taskId}:`, error.message);
    await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
  }
}

// Register task handler
taskRegistry.register('getServerSettings', processGetServerSettingsTask);

module.exports = {
  processGetServerSettingsTask,
};
