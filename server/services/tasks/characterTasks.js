// workers/processCharacterTasks.js
const { addTaskResult } = require('../../redisClient');
const { createCharacter, getCharacterByName, getCharactersByUser } = require('../../db/queries/characterQueries');
const { getAllClasses } = require('../../db/queries/classTemplatesQueries');
const taskRegistry = require('../../handlers/taskRegistry');
const logger = require('../../utilities/logger');


async function processClassListTask(task, redisClient) {
  const { taskId, data } = task.taskData;
  try {
    const classes = await getAllClasses();
    const result = { success: true, data: classes };
    logger.info(`Class list retrieval successful for task ${taskId}`);
    await addTaskResult(redisClient, taskId, result);
  } catch (error) {
    const result = { success: false, error: 'Failed to retrieve class list. ' + error.message };
    logger.error(`Class list retrieval failed for task ${taskId}: ${error.message}`);
    await addTaskResult(redisClient, taskId, result);
  }
}

async function processCharacterListTask(task, redisClient) {
  const { taskId, data } = task.taskData;
  const { userId } = data;

  try {
    const characters = await getCharactersByUser(userId);
    const result = { success: true, data: characters };
    logger.info(`Character list retrieval successful for task ${taskId}`);
    await addTaskResult(redisClient, taskId, result);
  } catch (error) {
    const result = { success: false, error: 'Failed to retrieve character list. ' + error.message };
    logger.error(`Character list retrieval failed for task ${taskId}: ${error.message}`);
    await addTaskResult(redisClient, taskId, result);
  }
}

async function processCreateCharacterTask(task, redisClient) {
  const { taskId, data } = task.taskData;
  const { userId, characterName, characterClass } = data;

  try {
    const characterId = await createCharacter(userId, characterName, characterClass);
    const result = { success: true, data: { characterId } };
    logger.info(`Character creation successful for task ${taskId}`);
    await addTaskResult(redisClient, taskId, result);
  } catch (error) {
    const result = { success: false, error: 'Failed to create character. ' + error.message };
    logger.error(`Character creation failed for task ${taskId}: ${error.message}`);
    await addTaskResult(redisClient, taskId, result);
  }
}

async function processLoginCharacterTask(task, redisClient) {
  const { taskId, data } = task.taskData;
  const { userId, characterName } = data;

  try {
    const character = await getCharacterByName(characterName);

    if (!character) {
      const result = { success: false, error: 'Character not found.' };
      await addTaskResult(redisClient, taskId, result);
      return;
    }

    // TODO : If the character has any stale groups that they are in, remove them

    if (character.userId !== userId) {
      const result = { success: false, error: 'Unauthorized access.' };
      logger.error(`Unauthorized access for task ${taskId}: User ID ${userId} does not match character owner ID ${character.userId}`);
      await addTaskResult(redisClient, taskId, result);
      return;
    }

    const result = { success: true, data: character };
    await addTaskResult(redisClient, taskId, result);
  } catch (error) {
    const result = { success: false, error: 'Failed to login character. ' + error.message };
    logger.error(`Character login failed for task ${taskId}: ${error.message}`);
    await addTaskResult(redisClient, taskId, result);
  }
}

// Register task handlers
taskRegistry.register('classList', processClassListTask);
taskRegistry.register('characterList', processCharacterListTask);
taskRegistry.register('createCharacter', processCreateCharacterTask);
taskRegistry.register('loginCharacter', processLoginCharacterTask);

module.exports = {
  processClassListTask,
  processCharacterListTask,
  processCreateCharacterTask,
  processLoginCharacterTask,
};
