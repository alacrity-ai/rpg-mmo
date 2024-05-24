const Redis = require('ioredis');
const { createCharacter, getCharacterByName } = require('../../db/queries/characterQueries');
const { getClassTemplateByName } = require('../../db/queries/classTemplatesQueries');
const taskRegistry = require('../server/taskRegistry');
const logger = require('../../utilities/logger');
const redis = new Redis();

async function processCreateCharacterTask(task) {
  const { taskId, data } = task.taskData;
  const { userId, characterName, characterClass } = data;

  try {
    // Create the character in the database
    const characterId = await createCharacter(userId, characterName, characterClass);

    const result = { success: true, data: { characterId } };
    logger.info(`Character creation successful for task ${taskId}`);
    await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
  } catch (error) {
    const result = { error: 'Failed to create character. ' + error.message };
    logger.info(`Character creation failed for task ${taskId}:`, error.message);
    await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
  }
}

async function processLoginCharacterTask(task) {
  const { taskId, data } = task.taskData;
  const { characterName } = data;

  try {
    // Get the character by name from the database
    const character = await getCharacterByName(characterName);

    if (!character) {
      const result = { error: 'Character not found.' };
      logger.info(`Character not found for task ${taskId}`);
      await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
      return;
    }

    const result = { success: true, data: character };
    logger.info(`Character login successful for task ${taskId}`);
    await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
  } catch (error) {
    const result = { error: 'Failed to login character. ' + error.message };
    logger.info(`Character login failed for task ${taskId}:`, error.message);
    await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
  }
}

// Register task handlers
taskRegistry.register('createCharacter', processCreateCharacterTask);
taskRegistry.register('loginCharacter', processLoginCharacterTask);

module.exports = {
  processCreateCharacterTask,
  processLoginCharacterTask,
};
