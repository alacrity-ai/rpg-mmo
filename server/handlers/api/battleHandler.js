const { enqueueTask } = require('../taskUtils');
const logger = require('../../utilities/logger');
const config = require('../../config/config');
const { setCacheBattleInstance, setCacheBattlerInstance } = require('../../db/cache/battle');

module.exports = (socket, io, redisClient) => {
  socket.on('getBattleInstance', async (data, callback) => {
    if (!socket.character || !socket.character.id) {
      callback({ error: 'Character not logged in.' });
      return;
    }
    const taskData = { areaId: data.areaId, characterId: socket.character.id };
    enqueueTask(redisClient, 'getBattleInstance', taskData, async (response) => {
      if (response.success) {
        const { battleInstance, battlerInstances } = response.data;

        // Cache the battle instance and battler instances
        await setCacheBattleInstance(redisClient, battleInstance);
        for (const battlerInstance of battlerInstances) {
          await setCacheBattlerInstance(redisClient, battlerInstance, battleInstance.id);
        }

        // Find the battler matching the character ID and bind battlerId and battleId to the socket
        const battler = battlerInstances.find(b => b.characterId === socket.character.id);
        if (battler) {
          socket.battler = { id: battler.id };
        }

        socket.battle = { id: battleInstance.id };

        // Call back to the client with the results of the getBattleInstance task
        callback(response);
      } else {
        callback(response);
      }
    });
  });

  // Handle joining a battle room
  socket.on('joinBattle', (battleInstanceId) => {
    try {
      socket.join(`battle-${battleInstanceId}`);
      logger.info(`User joined battle ${battleInstanceId}`);
    } catch (error) {
      logger.error(`Error joining battle ${battleInstanceId}: ${error.message}`);
      socket.emit('error', { message: `Failed to join battle ${battleInstanceId}` });
    }
  });

  // Handle leaving a battle room
  socket.on('leaveBattle', (battleInstanceId) => {
    try {
      socket.leave(`battle-${battleInstanceId}`);
      logger.info(`User left battle ${battleInstanceId}`);
    } catch (error) {
      logger.error(`Error leaving battle ${battleInstanceId}: ${error.message}`);
      socket.emit('error', { message: `Failed to leave battle ${battleInstanceId}` });
    }
  });
};
