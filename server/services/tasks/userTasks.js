// workers/processUserTasks.js
const { getRedisClient } = require('../../redisClient');
const { getUserByUsername, createUser } = require('../../db/queries/usersQueries');
const crypto = require('crypto');
const taskRegistry = require('../../handlers/taskRegistry');
const logger = require('../../utilities/logger');

const redisClient = getRedisClient();

async function processLoginTask(task) {
  const { taskId, data } = task.taskData;
  const { username, password } = data;
  const hash = crypto.createHash('sha256').update(password).digest('hex');

  try {
    const user = await getUserByUsername(username);
    if (user && user.passwordHash === hash) {
      const result = { success: true, data: user };
      await redisClient.xadd('task-result-stream', '*', 'taskId', taskId, 'result', JSON.stringify(result));
    } else {
      const result = { success: false, error: 'Invalid username or password.' };
      logger.error(`Login failed for task ${taskId}: Invalid username or password.`);
      await redisClient.xadd('task-result-stream', '*', 'taskId', taskId, 'result', JSON.stringify(result));
    }
  } catch (error) {
    const result = { success: false, error: 'Login failed. ' + error.message };
    logger.error(`Login failed for task ${taskId}: ${error.message}`);
    await redisClient.xadd('task-result-stream', '*', 'taskId', taskId, 'result', JSON.stringify(result));
  }
}

async function processCreateAccountTask(task) {
  const { taskId, data } = task.taskData;
  const { username, password } = data;

  if (typeof password !== 'string') {
    const result = { success: false, error: 'Invalid password format.' };
    logger.error(`Account creation failed for task ${taskId}: Invalid password format.`);
    await redisClient.xadd('task-result-stream', '*', 'taskId', taskId, 'result', JSON.stringify(result));
    return;
  }

  const hash = crypto.createHash('sha256').update(password).digest('hex');

  try {
    const user = await createUser(username, hash);
    const result = { success: true, data: user };
    await redisClient.xadd('task-result-stream', '*', 'taskId', taskId, 'result', JSON.stringify(result));
  } catch (error) {
    const result = { success: false, error: 'Failed to create account. ' + error.message };
    logger.error(`Account creation failed for task ${taskId}: ${error.message}`);
    await redisClient.xadd('task-result-stream', '*', 'taskId', taskId, 'result', JSON.stringify(result));
  }
}

// Register task handlers
taskRegistry.register('login', processLoginTask);
taskRegistry.register('createAccount', processCreateAccountTask);

module.exports = {
  processLoginTask,
  processCreateAccountTask,
};
