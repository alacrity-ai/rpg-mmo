const { enqueueTask } = require('../taskUtils');

module.exports = (socket) => {
  socket.on('viewShopInventory', async (data, callback) => {
    enqueueTask('viewShopInventory', data, callback);
  });
};
