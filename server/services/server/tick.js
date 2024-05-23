// services/tick.js
const { addTask } = require('./taskQueue');
const TICK_INTERVAL = 2000; // 2 seconds

function serverTick() {
  setInterval(async () => {
    const timestamp = new Date().toISOString();
    await addTask('serverTick', { timestamp });
    console.log(`Task added for server tick: ${timestamp}`);
  }, TICK_INTERVAL);
}

module.exports = { serverTick };
