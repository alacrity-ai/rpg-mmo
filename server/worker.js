require('dotenv').config();
const Redis = require('ioredis');
const { getTask } = require('./services/server/taskQueue');
const taskRegistry = require('./services/server/taskRegistry');
const logger = require('./utilities/logger');

const POLL_INTERVAL_MS = 250;

// Import task modules to ensure they are registered
require('./services/tasks/userTasks');
require('./services/tasks/shopTasks');
require('./services/tasks/characterTasks');
require('./services/tasks/battlerActionTasks');
require('./services/tasks/battleTasks');
require('./services/tasks/settingsTasks');
require('./services/tasks/partyTasks');
require('./services/tasks/zoneTasks');

const redis = new Redis();

async function processTasks() {
  while (true) {
    const task = await getTask();
    if (task) {
      logger.info(`Processing task: ${task}`);
      const { taskType } = task;
      const taskHandler = taskRegistry.getHandler(taskType);

      if (taskHandler) {
        try {
          await taskHandler(task);
        } catch (error) {
          logger.error(`Failed to process task ${taskType}: ${error}`);
          const result = { error: `Failed to process task ${taskType}. ` + error.message };
          await redis.publish(`task-result:${task.taskData.taskId}`, JSON.stringify({ taskId: task.taskData.taskId, result }));
        }
      } else {
        logger.error(`No worker task processor found for task type: ${taskType}`);
        const result = { error: `No handler found for task type: ${taskType}` };
        await redis.publish(`task-result:${task.taskData.taskId}`, JSON.stringify({ taskId: task.taskData.taskId, result }));
      }
    } else {
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS)); // Wait a bit before checking again
    }
  }
}

processTasks().catch(logger.error);
