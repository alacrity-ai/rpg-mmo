const { enqueueTask } = require('../taskUtils');

module.exports = (socket, io) => {
  socket.on('addBattlerAction', async (data, callback) => {
    const { battleInstanceId, battlerId, actionType, actionData } = data;
    if (!battleInstanceId || !battlerId || !actionType || !actionData) {
      callback({ error: 'Battle Instance ID, Battler ID, Action Type, and Action Data are required.' });
      return;
    }
    enqueueTask('addBattlerAction', { battleInstanceId, battlerId, actionType, actionData }, callback, io);
  });
};
