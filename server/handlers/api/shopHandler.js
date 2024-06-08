const { enqueueTask } = require('../taskUtils');

module.exports = (socket, io, redisClient) => {
  socket.on('viewShopInventory', async (data, callback) => {
    enqueueTask(redisClient, 'viewShopInventory', data, callback);
  });
};
