const { redisClient } = require('../redisClient');
const { addTask } = require('./taskQueue');
const logger = require('../utilities/logger');
const crypto = require('crypto');
const { handleTaskResult } = require('./taskResultHandler');

async function enqueueTask(taskType, taskData, callback, io, delay = 0) {
  try {
    const taskId = crypto.randomUUID(); // Generate a unique task ID
    const fullTaskData = { taskId, data: taskData };

    // Subscribe to a Redis channel for the task result
    const taskChannel = `task-result:${taskId}`;

    // Handle task result in a separate function
    handleTaskResult(taskChannel, callback, io);

    // Enqueue the task with or without delay
    if (delay > 0) {
      const executeTime = Date.now() + delay; // Calculate the future timestamp
      await redisClient.zadd('delayed-tasks', executeTime, JSON.stringify({ taskType, fullTaskData }));
      logger.info(`Delayed task added to queue: ${taskType}, to be executed in ${delay} ms`);
    } else {
      await addTask(taskType, fullTaskData);
      logger.info(`Task added to queue: ${taskType}`);
    }
  } catch (error) {
    logger.error(`Error enqueuing task: ${error.message}`);
    callback({ success: false, error: 'Task processing failed. ' + error.message });
  }
}

module.exports = {
  enqueueTask
};
