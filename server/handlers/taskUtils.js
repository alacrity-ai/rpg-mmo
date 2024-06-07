// handlers/taskUtils.js
const { getRedisClient } = require('../redisClient');
const { addTask } = require('./taskQueue');
const logger = require('../utilities/logger');
const crypto = require('crypto');

// Map to store callbacks
const callbackMap = new Map();

async function enqueueTask(taskType, taskData, callback, delay = 0) {
  const redisClient = getRedisClient();

  try {
    const taskId = crypto.randomUUID(); // Generate a unique task ID
    const fullTaskData = { taskId, data: taskData };

    // Store the callback in the map
    callbackMap.set(taskId, callback);

    // Enqueue the task with or without delay
    if (delay > 0) {
      const executeTime = Date.now() + delay; // Calculate the future timestamp
      await redisClient.zadd('delayed-tasks', executeTime, JSON.stringify({ taskType, fullTaskData }));
      logger.info(`Delayed task added to queue: ${taskType}, to be executed in ${delay} ms`);
    } else {
      await addTask(taskType, fullTaskData);
    }
  } catch (error) {
    logger.error(`Error enqueuing task: ${error.message}`);
    callback({ success: false, error: 'Task processing failed. ' + error.message });
  }
}

module.exports = {
  enqueueTask,
  callbackMap
};
