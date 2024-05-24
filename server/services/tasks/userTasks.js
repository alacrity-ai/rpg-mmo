const Redis = require('ioredis');
const { getUserByUsername, createUser } = require('../../db/queries/usersQueries');
const crypto = require('crypto');
const taskRegistry = require('../server/taskRegistry');

const redis = new Redis();

async function processLoginTask(task) {
  const { taskId, data } = task.taskData;
  const { username, password } = data;
  const hash = crypto.createHash('sha256').update(password).digest('hex');

  try {
    const user = await getUserByUsername(username);
    if (user && user.passwordHash === hash) {
      const result = { success: true, data: user };
      console.log(`Login successful for task ${taskId}`);
      await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
    } else {
      const result = { error: 'Invalid username or password.' };
      console.log(`Login failed for task ${taskId}: Invalid username or password.`);
      await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
    }
  } catch (error) {
    const result = { error: 'Login failed. ' + error.message };
    console.log(`Login failed for task ${taskId}:`, error.message);
    await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
  }
}

async function processCreateAccountTask(task) {
  const { taskId, data } = task.taskData;
  const { username, password } = data;

  if (typeof password !== 'string') {
    const result = { error: 'Invalid password format.' };
    console.log(`Account creation failed for task ${taskId}: Invalid password format.`);
    await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
    return;
  }

  const hash = crypto.createHash('sha256').update(password).digest('hex');

  try {
    const user = await createUser(username, hash);
    const result = { success: true, data: user };
    console.log(`Account creation successful for task ${taskId}`);
    await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
  } catch (error) {
    const result = { error: 'Failed to create account. ' + error.message };
    console.log(`Account creation failed for task ${taskId}:`, error.message);
    await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
  }
}

// Register task handlers
taskRegistry.register('login', processLoginTask);
taskRegistry.register('createAccount', processCreateAccountTask);

module.exports = {
  processLoginTask,
  processCreateAccountTask,
};
