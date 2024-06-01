const Redis = require('ioredis');
const { createCharacterParty } = require('../../db/queries/characterPartyQueries');
const { getCharacterByName } = require('../../db/queries/characterQueries');
const taskRegistry = require('../server/taskRegistry');
const logger = require('../../utilities/logger');
const redis = new Redis();

async function processCreatePartyTask(task) {
    const { taskId, data } = task.taskData;
    const { characterName } = data;
  
    try {
      // Create a new Character Party
      const character = await getCharacterByName(characterName);
      const characterParty = await createCharacterParty([{user_id: userId, character_id: character.id}]);
  
      if (!character) {
        const result = { error: 'Character not found.' };
        logger.info(`Character not found for task ${taskId}`);
        await redis.publish(`task-result:${taskId}`, JSON.stringify({ taskId, result }));
        return;
      }
  
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
