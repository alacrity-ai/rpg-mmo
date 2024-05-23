// services/taskQueue.js
const Redis = require('ioredis');
const redis = new Redis();

const TASK_QUEUE = 'taskQueue';

async function addTask(taskType, taskData) {
  const task = { taskType, taskData };
  await redis.rpush(TASK_QUEUE, JSON.stringify(task));
  console.log(`Task added: ${taskType}`, taskData);
}

async function getTask() {
  const task = await redis.lpop(TASK_QUEUE);
  return task ? JSON.parse(task) : null;
}

module.exports = {
  addTask,
  getTask
};
