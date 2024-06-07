const { getRedisClient } = require('../redisClient');
const logger = require('../utilities/logger');

const redisClient = getRedisClient();

const TASK_STREAM = 'taskQueueStream';
const CONSUMER_GROUP = 'taskGroup';

async function createStreamIfNotExists() {
  try {
    await redisClient.xadd(TASK_STREAM, '*', 'init', 'init');
    logger.info(`Stream ${TASK_STREAM} initialized`);
  } catch (err) {
    if (err.code !== 'ERR') {
      logger.error(`Error initializing stream ${TASK_STREAM}: ${err.message}`);
    }
  }
}

async function createConsumerGroup() {
  try {
    await redisClient.xgroup('CREATE', TASK_STREAM, CONSUMER_GROUP, '$', 'MKSTREAM');
    logger.info(`Consumer group ${CONSUMER_GROUP} created for stream ${TASK_STREAM}`);
  } catch (err) {
    if (err.code === 'BUSYGROUP') {
      logger.info(`Consumer group ${CONSUMER_GROUP} already exists for stream ${TASK_STREAM}`);
    } else if (err.code === 'NOGROUP') {
      logger.error(`Consumer group does not exist, retrying...`);
      await createStreamIfNotExists();
      await createConsumerGroup();
    } else {
      logger.error(`Error creating consumer group: ${err.message}`);
    }
  }
}

/**
 * Adds a task to the Redis stream.
 * @param {string} taskType - The type of the task.
 * @param {object} taskData - The data associated with the task.
 */
async function addTask(taskType, taskData) {
  const task = { taskType, taskData };
  try {
    // Ensure the Redis client is connected before attempting to add the task
    if (!redisClient.status || redisClient.status !== 'ready') {
      throw new Error('Redis client is not connected');
    }

    const result = await redisClient.xadd(TASK_STREAM, '*', 'task', JSON.stringify(task));
  } catch (error) {
    logger.error(`Error adding task to stream: ${error.message}`);
    throw error; // Re-throw the error to handle it in the caller function
  }
}

/**
 * Retrieves a task from the Redis stream.
 * @returns {object|null} - The retrieved task or null if no tasks are available.
 */
async function getTask() {
  try {
    const tasks = await redisClient.xreadgroup('GROUP', CONSUMER_GROUP, 'consumer1', 'COUNT', 1, 'BLOCK', 0, 'STREAMS', TASK_STREAM, '>');
    if (tasks.length > 0) {
      const [stream, messages] = tasks[0];
      const [id, message] = messages[0];
      const task = JSON.parse(message[1]);
      await redisClient.xack(TASK_STREAM, CONSUMER_GROUP, id);
      return task;
    } else {
      return null;
    }
  } catch (error) {
    logger.error(`Error retrieving task from stream: ${error.message}`);
    throw error; // Re-throw the error to handle it appropriately
  }
}

module.exports = {
  addTask,
  getTask,
  createConsumerGroup,
  createStreamIfNotExists
};
