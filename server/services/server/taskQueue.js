const Redis = require('ioredis');
const redis = new Redis();

const TASK_QUEUE = 'taskQueue';

async function addTask(taskType, taskData) {
  const task = { taskType, taskData };
  await redis.rpush(TASK_QUEUE, JSON.stringify(task));
  console.log(`Task added to queue: ${taskType}`);
}

async function getTask() {
  const task = await redis.lpop(TASK_QUEUE);
  if (task) {
    console.log('Task retrieved from queue:', task);
    return JSON.parse(task);
  } else {
    return null;
  }
}

module.exports = {
  addTask,
  getTask
};
