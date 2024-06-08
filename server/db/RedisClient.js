// redisClient.js
const Redis = require('ioredis');
const config = require('./config/config');
const logger = require('../utilities/logger');

const TASK_STREAM = 'taskQueueStream';
const CONSUMER_GROUP = 'taskGroup';

class RedisClient {
  constructor() {
    this.client = new Redis({
      host: config.redis.host,
      port: config.redis.port,
    });
  }

  async addTaskResult(taskId, result) {
    await this.client.xadd('task-result-stream', '*', 'taskId', taskId, 'result', JSON.stringify(result));
  }

  async createStreamIfNotExists() {
    try {
      await this.client.xadd(TASK_STREAM, '*', 'init', 'init');
      logger.info(`Stream ${TASK_STREAM} initialized`);
    } catch (err) {
      if (err.code !== 'ERR') {
        logger.error(`Error initializing stream ${TASK_STREAM}: ${err.message}`);
      }
    }
  }

  async createConsumerGroup() {
    try {
      await this.client.xgroup('CREATE', TASK_STREAM, CONSUMER_GROUP, '$', 'MKSTREAM');
      logger.info(`Consumer group ${CONSUMER_GROUP} created for stream ${TASK_STREAM}`);
    } catch (err) {
      if (err.code === 'BUSYGROUP') {
        logger.info(`Consumer group ${CONSUMER_GROUP} already exists for stream ${TASK_STREAM}`);
      } else if (err.code === 'NOGROUP') {
        logger.error(`Consumer group does not exist, retrying...`);
        await this.createStreamIfNotExists();
        await this.createConsumerGroup();
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
  async addTask(taskType, taskData) {
    const task = { taskType, taskData };
    try {
      // Ensure the Redis client is connected before attempting to add the task
      if (!this.client.status || this.client.status !== 'ready') {
        throw new Error('Redis client is not connected');
      }

      await this.client.xadd(TASK_STREAM, '*', 'task', JSON.stringify(task));
    } catch (error) {
      logger.error(`Error adding task to stream: ${error.message}`);
      throw error; // Re-throw the error to handle it in the caller function
    }
  }

  /**
   * Retrieves a task from the Redis stream.
   * @returns {object|null} - The retrieved task or null if no tasks are available.
   */
  async getTask() {
    try {
      const tasks = await this.client.xreadgroup('GROUP', CONSUMER_GROUP, 'consumer1', 'COUNT', 1, 'BLOCK', 0, 'STREAMS', TASK_STREAM, '>');
      if (tasks.length > 0) {
        const [stream, messages] = tasks[0];
        const [id, message] = messages[0];
        const task = JSON.parse(message[1]);
        await this.client.xack(TASK_STREAM, CONSUMER_GROUP, id);
        return task;
      } else {
        return null;
      }
    } catch (error) {
      logger.error(`Error retrieving task from stream: ${error.message}`);
      throw error; // Re-throw the error to handle it appropriately
    }
  }

  // Close the Redis client connection
  close() {
    this.client.quit();
  }
}

module.exports = RedisClient;
