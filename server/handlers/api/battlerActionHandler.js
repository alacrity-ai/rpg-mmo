const { enqueueTask } = require('../../db/cache/utility/taskUtils');

module.exports = (socket, io, redisClient) => {
  socket.on('addBattlerAction', async (data, callback) => {
    const { battleInstanceId, battlerId, actionType, actionData } = data;
    if (!battleInstanceId || !battlerId || !actionType || !actionData) {
      callback({ error: 'Battle Instance ID, Battler ID, Action Type, and Action Data are required.' });
      return;
    }
    enqueueTask(redisClient, 'addBattlerAction', { battleInstanceId, battlerId, actionType, actionData }, callback, io);
  });
};
