const { enqueueTask } = require('../db/cache/utility/taskUtils');

module.exports = (socket, io, redisClient) => {
  socket.on('viewShopInventory', async (data, callback) => {
    enqueueTask(redisClient, 'viewShopInventory', data, callback);
  });
};
