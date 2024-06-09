const { enqueueTask } = require('../db/cache/utility/taskUtils');

module.exports = (socket, io, redisClient) => {
  socket.on('getBattlerAbilities', async (data, callback) => {
    if (!socket.character || !socket.character.id) {
      callback({ error: 'Character not logged in.' });
      return;
    }

    if (!socket.battler || !socket.battler.id) {
      callback({ error: 'Battler not found.' });
      return;
    }

    const taskData = { battlerId: socket.battler.id };
    enqueueTask(redisClient, 'getBattlerAbilities', taskData, (response) => {
      if (response.success) {
        callback({ success: true, data: response.data });
      } else {
        callback({ success: false, error: response.error });
      }
    });
  });

  socket.on('getBattlers', async (data, callback) => {
    if (!socket.character || !socket.character.id) {
      callback({ error: 'Character not logged in.' });
      return;
    }

    const taskData = { characterId: socket.character.id, battleId: data.battleId };
    enqueueTask(redisClient, 'getBattlers', taskData, (response) => {
      if (response.success) {
        callback({ success: true, data: response.data });
      } else {
        callback({ success: false, error: response.error });
      }
    });
  });
};
