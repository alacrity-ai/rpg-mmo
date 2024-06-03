const Redis = require('ioredis');
const { createCharacter, getCharacterByName, getCharactersByUser } = require('../../db/queries/characterQueries');
const { getClassTemplateByName, getAllClasses } = require('../../db/queries/classTemplatesQueries');
const taskRegistry = require('../../handlers/taskRegistry');
const logger = require('../../utilities/logger');
const redis = new Redis();

async function processClassListTask(task) {
    const {taskId, data} = task.taskData;
    try {
        const classes = await getAllClasses();
        const result = { success: true, data: classes };
        logger.info(`Class list retrieval successful for task ${taskId}`);
        await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
    } catch (error) {
        const result = { error: 'Failed to retrieve class list. ' + error.message };
        logger.error(`Class list retrieval failed for task ${taskId}:`, error.message);
        await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
    }
}

async function processCharacterListTask(task) {
    const { taskId, data } = task.taskData;
    const { userId } = data;
  
    try {
      // Get the characters for the given user
      const characters = await getCharactersByUser(userId);
  
      const result = { success: true, data: characters };
      logger.info(`Character list retrieval successful for task ${taskId}`);
      await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
    } catch (error) {
      const result = { error: 'Failed to retrieve character list. ' + error.message };
      logger.error(`Character list retrieval failed for task ${taskId}:`, error.message);
      await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
    }
}

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
  const { userId, characterName } = data;

  try {
      // Get the character by name from the database
      const character = await getCharacterByName(characterName);

      if (!character) {
          const result = { error: 'Character not found.' };
          logger.info(`Character not found for task ${taskId}`);
          await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
          return;
      }

      // TODO : If the character has any stale groups that they are in, remove them

      // Check if the character belongs to the user
      if (character.userId !== userId) {
          const result = { error: 'Unauthorized access.' };
          logger.info(`Unauthorized access for task ${taskId}: User ID ${userId} does not match character owner ID ${character.userId}`);
          await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
          return;
      }

      const result = { success: true, data: character };
      logger.info(`Character login successful for task ${taskId}`);
      await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
  } catch (error) {
      const result = { error: 'Failed to login character. ' + error.message };
      logger.error(`Character login failed for task ${taskId}:`, error.message);
      await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
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
