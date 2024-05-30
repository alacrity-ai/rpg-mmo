const { enqueueTask } = require('../../services/server/taskUtils');

module.exports = (socket) => {
  socket.on('createBattle', async (data, callback) => {
    const { characterIds, npcTemplateIds } = data;
    if (!characterIds || !npcTemplateIds) {
      callback({ error: 'Character IDs and NPC Template IDs are required.' });
      return;
    }
    enqueueTask('createBattle', { characterIds, npcTemplateIds }, callback);
  });

  socket.on('getBattle', async (data, callback) => {
    const { battleId } = data;
    if (!battleId) {
      callback({ error: 'Battle ID is required.' });
      return;
    }
    enqueueTask('getBattle', { battleId }, callback);
  });

  socket.on('getAllBattles', async (data, callback) => {
    enqueueTask('getAllBattles', {}, callback);
  });

  socket.on('deleteBattle', async (data, callback) => {
    const { battleId } = data;
    if (!battleId) {
      callback({ error: 'Battle ID is required.' });
      return;
    }
    enqueueTask('deleteBattle', { battleId }, callback);
  });

  socket.on('getBattlersInBattle', async (data, callback) => {
    const { battleId } = data;
    if (!battleId) {
      callback({ error: 'Battle ID is required.' });
      return;
    }
    enqueueTask('getBattlersInBattle', { battleId }, callback);
  });
};
