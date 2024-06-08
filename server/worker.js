// workers/worker.js
const config = require('./config/config');
const redisClient = require('./db/cache/client/RedisClient').getRedisClient();
const { getTask } = require('./db/cache/utility/taskQueue');
const taskRegistry = require('./services/tasks/registry/taskRegistry');
const logger = require('./utilities/logger');

const MIN_POLL_INTERVAL_MS = 50;
const MAX_POLL_INTERVAL_MS = 100;
let currentPollInterval = MIN_POLL_INTERVAL_MS;

const LOCK_EXPIRATION_MS = 5000; // Lock expiration time in milliseconds

// Import task modules to ensure they are registered
require('./services/tasks/scriptTasks');
require('./services/tasks/userTasks');
require('./services/tasks/shopTasks');
require('./services/tasks/characterTasks');
require('./services/tasks/battlerActionTasks');
require('./services/tasks/battleTasks');
require('./services/tasks/battlerTasks');
require('./services/tasks/settingsTasks');
require('./services/tasks/partyTasks');
require('./services/tasks/zoneTasks');

async function processTasks() {
  while (true) {
    const task = await getTask(redisClient);
    if (task) {
      logger.info(`Processing task: ${JSON.stringify(task)}`);
      const { taskType } = task;
      const taskHandler = taskRegistry.getHandler(taskType);

      if (taskHandler) {
        try {
          await taskHandler(task, redisClient);
          currentPollInterval = MIN_POLL_INTERVAL_MS; // Reset interval after successful task processing
        } catch (error) {
          logger.error(`Failed to process task ${taskType}: ${error}`);
          const result = { error: `Failed to process task ${taskType}. ` + error.message };
          await redisClient.xadd('task-result-stream', '*', 'taskId', task.taskData.taskId, 'result', JSON.stringify({ taskId: task.taskData.taskId, result }));
        }
      } else {
        logger.error(`No worker task processor found for task type: ${taskType}`);
        const result = { error: `No handler found for task type: ${taskType}` };
        await redisClient.xadd('task-result-stream', '*', 'taskId', task.taskData.taskId, 'result', JSON.stringify({ taskId: task.taskData.taskId, result }));
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
    const tasks = await redisClient.zrangebyscore('delayed-tasks', 0, now, 'WITHSCORES', 'LIMIT', 0, 10);

    for (let i = 0; i < tasks.length; i += 2) {
      const task = JSON.parse(tasks[i]);
      const score = tasks[i + 1];

      if (score <= now) {
        const { taskType, fullTaskData } = task;
        const lockKey = `lock:${taskType}:${fullTaskData.taskId}`;
        const processingKey = `processing:${taskType}:${fullTaskData.taskId}`;

        // Attempt to acquire the lock
        const lockAcquired = await redisClient.set(lockKey, 'locked', 'NX', 'PX', LOCK_EXPIRATION_MS);
        if (!lockAcquired) {
          continue; // If lock not acquired, skip to the next task
        }

        // Check if the task is already being processed
        const processingFlag = await redisClient.exists(processingKey);
        if (processingFlag) {
          await redisClient.del(lockKey); // Release the lock if task is already being processed
          continue;
        }

        // Set the processing flag
        await redisClient.set(processingKey, 'processing', 'PX', LOCK_EXPIRATION_MS);

        const taskHandler = taskRegistry.getHandler(taskType);

        if (taskHandler) {
          try {
            // Ensure fullTaskData is in the correct structure
            await taskHandler({ taskType, taskData: fullTaskData });
            const result = { success: true, data: fullTaskData };
            logger.info(`Delayed task processed successfully: ${taskType}`);
            await redisClient.xadd('task-result-stream', '*', 'taskId', fullTaskData.taskId, 'result', JSON.stringify({ taskId: fullTaskData.taskId, result }));
          } catch (error) {
            const result = { error: 'Failed to process delayed task. ' + error.message };
            logger.error(`Failed to process delayed task ${taskType}: ${error.message}`);
            await redisClient.xadd('task-result-stream', '*', 'taskId', fullTaskData.taskId, 'result', JSON.stringify({ taskId: fullTaskData.taskId, result }));
          } finally {
            // Remove the processing flag and the lock after processing the task
            await redisClient.del(processingKey);
            await redisClient.del(lockKey);
          }
        } else {
          logger.error(`No worker task processor found for delayed task type: ${taskType}`);
          const result = { error: `No handler found for delayed task type: ${taskType}` };
          await redisClient.xadd('task-result-stream', '*', 'taskId', fullTaskData.taskId, 'result', JSON.stringify({ taskId: fullTaskData.taskId, result }));
        }

        await redisClient.zrem('delayed-tasks', tasks[i]);
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
