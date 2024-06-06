const { redisClient } = require('../redisClient');
const logger = require('../utilities/logger');

const TASK_QUEUE = 'taskQueue';

async function addTask(taskType, taskData) {
  const task = { taskType, taskData };
  await redisClient.rpush(TASK_QUEUE, JSON.stringify(task));
}

async function getTask() {
  const task = await redisClient.lpop(TASK_QUEUE);
  if (task) {
    return JSON.parse(task);
  } else {
    return null;
  }
}

module.exports = {
  addTask,
  getTask
};
