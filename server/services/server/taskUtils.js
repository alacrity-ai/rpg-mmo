const Redis = require('ioredis');
const redis = new Redis();
const { addTask } = require('./taskQueue');

async function enqueueTask(taskType, taskData, callback) {
  try {
    const taskId = crypto.randomUUID(); // Generate a unique task ID
    const fullTaskData = { taskId, data: taskData };

    // Subscribe to a Redis channel for the task result
    const taskChannel = `task-result:${taskId}`;
    const onTaskResult = (channel, message) => {
      console.log(`Message received on channel ${channel}:`, message);
      const response = JSON.parse(message);
      if (response.taskId === taskId) {
        console.log('Task result received:', response.result);
        callback(response.result);
        redis.unsubscribe(taskChannel);
        redis.off('message', onTaskResult);
      }
    };

    redis.subscribe(taskChannel, (err, count) => {
      if (err) {
        console.error('Failed to subscribe: ', err);
        callback({ error: 'Subscription failed. ' + err.message });
      } else {
        console.log(`Subscribed to ${taskChannel}. ${count} total subscriptions.`);
        redis.on('message', onTaskResult);

        // Enqueue the task
        addTask(taskType, fullTaskData).then(() => {
        // No log message needed here for now
        }).catch((err) => {
          console.error('Failed to add task to queue: ', err);
          callback({ error: 'Task enqueue failed. ' + err.message });
        });
      }
    });
  } catch (error) {
    callback({ error: 'Task processing failed. ' + error.message });
  }
}

module.exports = {
  enqueueTask
};
