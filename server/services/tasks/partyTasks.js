// workers/processPartyTasks.js
const { addTaskResult } = require('../../db/cache/client/RedisClient');
const taskRegistry = require('./registry/taskRegistry');
const { createCharacterParty, removeMemberFromParty, getCharactersInParty } = require('../../db/queries/characterPartyQueries');
const logger = require('../../utilities/logger');


async function processCreatePartyTask(task, redisClient) {
  const { taskId, data } = task.taskData;
  const { characterId, userId } = data;

  try {
    // Create the party in the database with the sole member
    const partyId = await createCharacterParty([{ character_id: characterId, user_id: userId }]);

    const result = { success: true, data: { partyId } };
    await addTaskResult(redisClient, taskId, result);
  } catch (error) {
    const result = { success: false, error: 'Failed to create party. ' + error.message };
    logger.error(`Party creation failed for task ${taskId}: ${error.message}`);
    await addTaskResult(redisClient, taskId, result);
  }
}

async function processLeavePartyTask(task, redisClient) {
  const { taskId, data } = task.taskData;
  const { partyId, characterId } = data;

  try {
    await removeMemberFromParty(partyId, characterId);

    const result = { success: true };
    await addTaskResult(redisClient, taskId, result);
  } catch (error) {
    const result = { success: false, error: 'Failed to leave party. ' + error.message };
    logger.error(`Party leave failed for task ${taskId}: ${error.message}`);
    await addTaskResult(redisClient, taskId, result);
  }
}

async function processGetPartyTask(task, redisClient) {
  const { taskId, data } = task.taskData;
  const { characterId, partyId } = data;

  try {
    // Fetch the party data
    const characters = await getCharactersInParty(partyId);

    const result = { success: true, data: characters };
    await addTaskResult(redisClient, taskId, result);
  } catch (error) {
    const result = { success: false, error: 'Failed to get party data. ' + error.message };
    logger.error(`Party data retrieval failed for task ${taskId}: ${error.message}`);
    await addTaskResult(redisClient, taskId, result);
  }
}


// Register task handlers
taskRegistry.register('createParty', processCreatePartyTask);
taskRegistry.register('leaveParty', processLeavePartyTask);
taskRegistry.register('getParty', processGetPartyTask);

module.exports = {
  processCreatePartyTask,
  processLeavePartyTask,
  processGetPartyTask
};
