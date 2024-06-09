const { addTaskResult } = require('../../db/cache/client/RedisClient');
const taskRegistry = require('./registry/taskRegistry');
const { createCharacterParty, removeMemberFromParty, getCharactersInParty, addMemberToParty, getPartyByCharacterId } = require('../../db/queries/characterPartyQueries');
const { getCharacterByName } = require('../../db/queries/characterQueries');
const logger = require('../../utilities/logger');

async function processCreatePartyTask(task, redisClient) {
  const { taskId, data } = task.taskData;
  const { characterId, userId } = data;

  try {
    // Remove the character from their current party if they are in one
    const currentParty = await getPartyByCharacterId(characterId);
    if (currentParty) {
      await removeMemberFromParty(currentParty.id, characterId);
    }

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

    const result = { success: true, data: { partyId } };
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

    const result = { success: true, data: { characters } };
    await addTaskResult(redisClient, taskId, result);
  } catch (error) {
    const result = { success: false, error: 'Failed to get party data. ' + error.message };
    logger.error(`Party data retrieval failed for task ${taskId}: ${error.message}`);
    await addTaskResult(redisClient, taskId, result);
  }
}

async function processInviteToPartyTask(task, redisClient) {
  const { taskId, data } = task.taskData;
  const { partyId, invitedCharacterName } = data;

  try {
    // Get the invited character's Id by name
    const character = await getCharacterByName(invitedCharacterName);
    if (!character) {
      throw new Error(`Character with name ${invitedCharacterName} not found.`);
    }
    // Send the result with the invited character instance back to the handler
    const result = { success: true, data: { character }};
    await addTaskResult(redisClient, taskId, result);
  } catch (error) {
    const result = { success: false, error: 'Failed to invite to party. ' + error.message };
    logger.error(`Party invite failed for task ${taskId}: ${error.message}`);
    await addTaskResult(redisClient, taskId, result);
  }
}

async function processRespondToPartyInviteTask(task, redisClient) {
  const { taskId, data } = task.taskData;
  const { characterId, partyId, userId, accept } = data;

  try {
    if (accept) {
      // ADDED THIS: Remove the invited character from their current party
      const currentParty = await getPartyByCharacterId(characterId);
      await removeMemberFromParty(currentParty.id, characterId);

      // Add the invited character to the party in the database
      await addMemberToParty(partyId, userId, characterId);
    }

    const result = { success: true, data: { accepted: accept }};
    await addTaskResult(redisClient, taskId, result);
  } catch (error) {
    const result = { success: false, error: 'Failed to respond to party invite. ' + error.message };
    logger.error(`Responding to party invite failed for task ${taskId}: ${error.message}`);
    await addTaskResult(redisClient, taskId, result);
  }
}

// Register task handlers
taskRegistry.register('createParty', processCreatePartyTask);
taskRegistry.register('leaveParty', processLeavePartyTask);
taskRegistry.register('getParty', processGetPartyTask);
taskRegistry.register('inviteToParty', processInviteToPartyTask);
taskRegistry.register('respondToPartyInvite', processRespondToPartyInviteTask);

module.exports = {
  processCreatePartyTask,
  processLeavePartyTask,
  processGetPartyTask,
  processInviteToPartyTask,
  processRespondToPartyInviteTask
};
