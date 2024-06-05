const config = require('./config/config');
const Redis = require('ioredis');
const { getTask, addTask } = require('./handlers/taskQueue');
const taskRegistry = require('./handlers/taskRegistry');
const logger = require('./utilities/logger');

const MIN_POLL_INTERVAL_MS = 50;
const MAX_POLL_INTERVAL_MS = 100;
let currentPollInterval = MIN_POLL_INTERVAL_MS;

// Import task modules to ensure they are registered
require('./services/tasks/userTasks');
require('./services/tasks/shopTasks');
require('./services/tasks/characterTasks');
require('./services/tasks/battlerActionTasks');
require('./services/tasks/battleTasks');
require('./services/tasks/battlerTasks');
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
          currentPollInterval = MIN_POLL_INTERVAL_MS; // Reset interval after successful task processing
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
      currentPollInterval = Math.min(currentPollInterval + 50, MAX_POLL_INTERVAL_MS); // Increase interval if no task found
      await new Promise((resolve) => setTimeout(resolve, currentPollInterval));
    }
  }
}

async function processDelayedTasks() {
  while (true) {
    const now = Date.now();
    const tasks = await redis.zrangebyscore('delayed-tasks', 0, now, 'WITHSCORES', 'LIMIT', 0, 10);

    for (let i = 0; i < tasks.length; i += 2) {
      const task = JSON.parse(tasks[i]);
      const score = tasks[i + 1];

      if (score <= now) {
        const { taskType, fullTaskData } = task;
        const taskHandler = taskRegistry.getHandler(taskType);

        if (taskHandler) {
          try {
            await taskHandler(fullTaskData);
            const result = { success: true, data: fullTaskData };
            logger.info(`Delayed task processed successfully: ${taskType}`);
            await redis.publish(`task-result:${fullTaskData.taskId}`, JSON.stringify({ taskId: fullTaskData.taskId, result }));
          } catch (error) {
            const result = { error: 'Failed to process delayed task. ' + error.message };
            logger.error(`Failed to process delayed task ${taskType}: ${error.message}`);
            await redis.publish(`task-result:${fullTaskData.taskId}`, JSON.stringify({ taskId: fullTaskData.taskId, result }));
          }
        } else {
          logger.error(`No worker task processor found for delayed task type: ${taskType}`);
          const result = { error: `No handler found for delayed task type: ${taskType}` };
          await redis.publish(`task-result:${fullTaskData.taskId}`, JSON.stringify({ taskId: fullTaskData.taskId, result }));
        }

        await redis.zrem('delayed-tasks', tasks[i]);
      }
    }

    // Wait for a short period before polling again
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

// Start the main task processing and delayed task processing concurrently
async function startWorkers() {
  await Promise.all([
    processTasks().catch(logger.error),
    processDelayedTasks().catch(logger.error)
  ]);
}

startWorkers().catch(logger.error);
