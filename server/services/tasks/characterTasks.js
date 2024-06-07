// workers/processCharacterTasks.js
const { getRedisClient } = require('../../redisClient');
const { createCharacter, getCharacterByName, getCharactersByUser } = require('../../db/queries/characterQueries');
const { getAllClasses } = require('../../db/queries/classTemplatesQueries');
const taskRegistry = require('../../handlers/taskRegistry');
const logger = require('../../utilities/logger');

const redisClient = getRedisClient();

async function processClassListTask(task) {
  const { taskId, data } = task.taskData;
  try {
    const classes = await getAllClasses();
    const result = { success: true, data: classes };
    logger.info(`Class list retrieval successful for task ${taskId}`);
    await redisClient.xadd('task-result-stream', '*', 'taskId', taskId, 'result', JSON.stringify(result));
  } catch (error) {
    const result = { success: false, error: 'Failed to retrieve class list. ' + error.message };
    logger.error(`Class list retrieval failed for task ${taskId}: ${error.message}`);
    await redisClient.xadd('task-result-stream', '*', 'taskId', taskId, 'result', JSON.stringify(result));
  }
}

async function processCharacterListTask(task) {
  const { taskId, data } = task.taskData;
  const { userId } = data;

  try {
    const characters = await getCharactersByUser(userId);
    const result = { success: true, data: characters };
    logger.info(`Character list retrieval successful for task ${taskId}`);
    await redisClient.xadd('task-result-stream', '*', 'taskId', taskId, 'result', JSON.stringify(result));
  } catch (error) {
    const result = { success: false, error: 'Failed to retrieve character list. ' + error.message };
    logger.error(`Character list retrieval failed for task ${taskId}: ${error.message}`);
    await redisClient.xadd('task-result-stream', '*', 'taskId', taskId, 'result', JSON.stringify(result));
  }
}

async function processCreateCharacterTask(task) {
  const { taskId, data } = task.taskData;
  const { userId, characterName, characterClass } = data;

  try {
    const characterId = await createCharacter(userId, characterName, characterClass);
    const result = { success: true, data: { characterId } };
    logger.info(`Character creation successful for task ${taskId}`);
    await redisClient.xadd('task-result-stream', '*', 'taskId', taskId, 'result', JSON.stringify(result));
  } catch (error) {
    const result = { success: false, error: 'Failed to create character. ' + error.message };
    logger.info(`Character creation failed for task ${taskId}: ${error.message}`);
    await redisClient.xadd('task-result-stream', '*', 'taskId', taskId, 'result', JSON.stringify(result));
  }
}

async function processLoginCharacterTask(task) {
  const { taskId, data } = task.taskData;
  const { userId, characterName } = data;

  try {
    const character = await getCharacterByName(characterName);

    if (!character) {
      const result = { success: false, error: 'Character not found.' };
      await redisClient.xadd('task-result-stream', '*', 'taskId', taskId, 'result', JSON.stringify(result));
      return;
    }

    // TODO : If the character has any stale groups that they are in, remove them

    if (character.userId !== userId) {
      const result = { success: false, error: 'Unauthorized access.' };
      logger.error(`Unauthorized access for task ${taskId}: User ID ${userId} does not match character owner ID ${character.userId}`);
      await redisClient.xadd('task-result-stream', '*', 'taskId', taskId, 'result', JSON.stringify(result));
      return;
    }

    const result = { success: true, data: character };
    await redisClient.xadd('task-result-stream', '*', 'taskId', taskId, 'result', JSON.stringify(result));
  } catch (error) {
    const result = { success: false, error: 'Failed to login character. ' + error.message };
    await redisClient.xadd('task-result-stream', '*', 'taskId', taskId, 'result', JSON.stringify(result));
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
