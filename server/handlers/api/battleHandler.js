// handlers/api/battleHandler.js

const { enqueueTask } = require('../taskUtils');
const logger = require('../../utilities/logger');
const config = require('../../config/config')

module.exports = (socket) => {
  socket.on('getBattleInstance', async (data, callback) => {
    if (!socket.character || !socket.character.id) {
      callback({ error: 'Character not logged in.' });
      return;
    }
    const taskData = { areaId: data.areaId, characterId: socket.character.id };
    enqueueTask('getBattleInstance', taskData, (response) => {
      if (response.success) {
        const { battleInstance, battlerInstances } = response.data;

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
};
