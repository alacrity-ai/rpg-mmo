const { enqueueTask } = require('../../services/server/taskUtils');

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

        // Proceed to call back to the client
        callback(response);
      } else {
        callback(response);
      }
    });
  });
};
