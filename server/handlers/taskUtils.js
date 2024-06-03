// services/server/taskUtils.js

const Redis = require('ioredis');
const redis = new Redis();
const { addTask } = require('./taskQueue');
const logger = require('../utilities/logger');
const crypto = require('crypto');
const { handleTaskResult } = require('./taskResultHandler');

async function enqueueTask(taskType, taskData, callback, io) {
  try {
    const taskId = crypto.randomUUID(); // Generate a unique task ID
    const fullTaskData = { taskId, data: taskData };

    // Subscribe to a Redis channel for the task result
    const taskChannel = `task-result:${taskId}`;

    // Handle task result in a separate function
    handleTaskResult(taskChannel, callback, io);

    // Enqueue the task
    await addTask(taskType, fullTaskData);
    logger.info(`Task added to queue: ${taskType}`);
  } catch (error) {
    logger.error(`Error enqueuing task: ${error.message}`);
    callback({ success: false, error: 'Task processing failed. ' + error.message });
  }
}

module.exports = {
  enqueueTask
};
