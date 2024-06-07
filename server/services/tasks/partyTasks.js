// workers/processPartyTasks.js
const { getRedisClient } = require('../../redisClient');
const { createCharacterParty, removeMemberFromParty } = require('../../db/queries/characterPartyQueries');
const taskRegistry = require('../../handlers/taskRegistry');
const logger = require('../../utilities/logger');

const redisClient = getRedisClient();

async function processCreatePartyTask(task) {
  const { taskId, data } = task.taskData;
  const { characterId, userId } = data;

  try {
    // Create the party in the database with the sole member
    const partyId = await createCharacterParty([{ character_id: characterId, user_id: userId }]);

    const result = { success: true, data: { partyId } };
    logger.info(`Party creation successful for task ${taskId}`);
    await redisClient.xadd('task-result-stream', '*', 'taskId', taskId, 'result', JSON.stringify(result));
  } catch (error) {
    const result = { success: false, error: 'Failed to create party. ' + error.message };
    logger.error(`Party creation failed for task ${taskId}: ${error.message}`);
    await redisClient.xadd('task-result-stream', '*', 'taskId', taskId, 'result', JSON.stringify(result));
  }
}

async function processLeavePartyTask(task) {
  const { taskId, data } = task.taskData;
  const { partyId, characterId } = data;

  try {
    await removeMemberFromParty(partyId, characterId);

    const result = { success: true };
    logger.info(`Party leave successful for task ${taskId}`);
    await redisClient.xadd('task-result-stream', '*', 'taskId', taskId, 'result', JSON.stringify(result));
  } catch (error) {
    const result = { success: false, error: 'Failed to leave party. ' + error.message };
    logger.error(`Party leave failed for task ${taskId}: ${error.message}`);
    await redisClient.xadd('task-result-stream', '*', 'taskId', taskId, 'result', JSON.stringify(result));
  }
}

// Register task handlers
taskRegistry.register('createParty', processCreatePartyTask);
taskRegistry.register('leaveParty', processLeavePartyTask);

module.exports = {
  processCreatePartyTask,
  processLeavePartyTask,
};
