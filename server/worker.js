require('dotenv').config();
const Redis = require('ioredis');
const { getTask } = require('./services/server/taskQueue');
const TICK_INTERVAL = 2000; // 2 seconds

const redis = new Redis();

async function processTasks() {
  while (true) {
    const task = await getTask();
    if (task) {
      if (task.taskType === 'serverTick') {
        const { timestamp } = task.taskData;
        console.log(`Processed task: Server tick: ${timestamp}`);
        redis.publish('serverTickChannel', `Server tick: ${timestamp}`);
      }
    }
    await new Promise(resolve => setTimeout(resolve, TICK_INTERVAL));
  }
}

processTasks().catch(console.error);
