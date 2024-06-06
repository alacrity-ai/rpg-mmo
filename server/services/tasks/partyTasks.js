const { redisClient } = require('../../redisClient');
const { createCharacterParty, removeMemberFromParty } = require('../../db/queries/characterPartyQueries');
const taskRegistry = require('../../handlers/taskRegistry');
const logger = require('../../utilities/logger');

async function processCreatePartyTask(task) {
  const { taskId, data } = task.taskData;
  const { characterId } = data;

  try {
    // Create the party in the database with the sole member
    const partyId = await createCharacterParty([{ character_id: characterId, user_id: data.userId }]);

    const result = { success: true, data: { partyId } };
    logger.info(`Party creation successful for task ${taskId}`);
    await redisClient.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
  } catch (error) {
    const result = { error: 'Failed to create party. ' + error.message };
    logger.error(`Party creation failed for task ${taskId}:`, error.message);
    await redisClient.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
  }
}

async function processLeavePartyTask(task) {
  const { taskId, data } = task.taskData;
  const { partyId, characterId } = data;

  try {
    await removeMemberFromParty(partyId, characterId);

    const result = { success: true };
    logger.info(`Party leave successful for task ${taskId}`);
    await redisClient.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
  } catch (error) {
    const result = { error: 'Failed to leave party. ' + error.message };
    logger.error(`Party leave failed for task ${taskId}:`, error.message);
    await redisClient.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
  }
}

// Register task handlers
taskRegistry.register('createParty', processCreatePartyTask);
taskRegistry.register('leaveParty', processLeavePartyTask);

module.exports = {
  processCreatePartyTask,
  processLeavePartyTask,
};
