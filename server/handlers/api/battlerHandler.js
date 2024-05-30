const { enqueueTask } = require('../../services/server/taskUtils');

module.exports = (socket) => {
  socket.on('createBattlerFromCharacter', async (data, callback) => {
    const { characterIds } = data;
    if (!characterIds) {
      callback({ error: 'Character IDs are required.' });
      return;
    }
    enqueueTask('createBattlerFromCharacter', { characterIds }, callback);
  });

  socket.on('createBattlerFromNPC', async (data, callback) => {
    const { npcTemplateIds } = data;
    if (!npcTemplateIds) {
      callback({ error: 'NPC Template IDs are required.' });
      return;
    }
    enqueueTask('createBattlerFromNPC', { npcTemplateIds }, callback);
  });

  socket.on('getBattler', async (data, callback) => {
    const { battlerId } = data;
    if (!battlerId) {
      callback({ error: 'Battler ID is required.' });
      return;
    }
    enqueueTask('getBattler', { battlerId }, callback);
  });

  socket.on('updateBattler', async (data, callback) => {
    const { battlerId, updates } = data;
    if (!battlerId || !updates) {
      callback({ error: 'Battler ID and updates are required.' });
      return;
    }
    enqueueTask('updateBattler', { battlerId, updates }, callback);
  });

  socket.on('deleteBattler', async (data, callback) => {
    const { battlerId } = data;
    if (!battlerId) {
      callback({ error: 'Battler ID is required.' });
      return;
    }
    enqueueTask('deleteBattler', { battlerId }, callback);
  });

  socket.on('canBattlerAct', async (data, callback) => {
    const { battlerId } = data;
    if (!battlerId) {
      callback({ error: 'Battler ID is required.' });
      return;
    }
    enqueueTask('canBattlerAct', { battlerId }, callback);
  });
};
